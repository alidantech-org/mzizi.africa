/** SQL follows registered routing roots and slugs, never country names or a guessed hierarchy. */
/** $1 is the public origin of the object store (empty when none is configured), used to turn a stored key into a URL. */
export const countriesSql = `select c.id, c.iso_alpha2 as code, c.name, c.is_served as served,
  (select case when count(distinct l.root_feature_id)=1 then min(l.root_feature_id::text)::uuid else null end
   from geography.levels l where l.country_id=c.id and l.is_routing_hierarchy and l.depth=0 and l.deleted_at is null) as "rootFeatureId",
  (select case when $1::text = '' then null else $1::text || fv.s3_key end
     from filesystem.media m
     join reference.values k on k.id=m.kind_id and k.code='ref.val.fil.media.kind.flag'
     join filesystem.file_versions fv on fv.id=m.file_version_id
    where m.subject_table='reference.countries' and m.subject_id=c.id and m.deleted_at is null
    order by m.position nulls last, m.id limit 1) as "flagUrl",
  coalesce((select m.metadata->'colors'->'swatches'
     from filesystem.media m
     join reference.values k on k.id=m.kind_id and k.code='ref.val.fil.media.kind.flag'
    where m.subject_table='reference.countries' and m.subject_id=c.id and m.deleted_at is null and m.metadata is not null
    order by m.position nulls last, m.id limit 1), '[]'::jsonb) as "flagColors"
  from reference.countries c where c.deleted_at is null and c.iso_alpha2 is not null order by c.name,c.id`;

/** $1 country identity, $2 language. Parentage is the registered route, not service coverage or authority. */
export const placeCte = `with recursive routes as (
  select s.id,s.subject_id as feature_id,s.parent_slug_id,array[s.slug]::text[] as segments,array[s.id] as visited,
    array[s.subject_id] as ancestors,null::uuid as parent_feature_id
  from source.slugs s where s.country_id=$1 and s.parent_slug_id is null and s.subject_table='geography.features'
    and s.canonical_slug_id is null and s.deleted_at is null and (s.from_year is null or s.from_year<=extract(year from current_date))
    and (s.to_year is null or s.to_year>=extract(year from current_date))
  union all
  select s.id,s.subject_id,s.parent_slug_id,r.segments||s.slug,r.visited||s.id,r.ancestors||s.subject_id,r.feature_id
  from routes r join source.slugs s on s.parent_slug_id=r.id
  where s.country_id=$1 and s.subject_table='geography.features' and s.canonical_slug_id is null and s.deleted_at is null
    and (s.from_year is null or s.from_year<=extract(year from current_date)) and (s.to_year is null or s.to_year>=extract(year from current_date))
    and not s.id=any(r.visited)
), root as (
  select case when count(distinct l.root_feature_id)=1 then min(l.root_feature_id::text)::uuid else null end as feature_id
  from geography.levels l where l.country_id=$1 and l.is_routing_hierarchy and l.depth=0 and l.deleted_at is null
), registered as (
  select root.feature_id,array[]::text[] as segments,null::uuid as parent_feature_id,array[root.feature_id] as ancestors from root where root.feature_id is not null
  union all
  select r.feature_id,r.segments,coalesce(r.parent_feature_id,root.feature_id),array[root.feature_id]||r.ancestors
  from routes r cross join root where r.feature_id is distinct from root.feature_id
), reg as materialized (
  select distinct on (feature_id,segments) feature_id,segments,parent_feature_id,ancestors from registered order by feature_id,segments
), places as (
  select p.feature_id,p.segments,p.parent_feature_id,p.ancestors,
    f.code,coalesce(n.name,f.code) as name,n.language_code,coalesce(vl.label,k.label) as kind,k.code as kind_code,
    c.iso_alpha2 as country_code,'/'||lower(c.iso_alpha2)||case when cardinality(p.segments)>0 then '/'||array_to_string(p.segments,'/') else '' end as path
  from reg p
  cross join lateral (select f.id,f.code,f.feature_type_id from geography.features f where f.id=p.feature_id and f.deleted_at is null
    and (f.from_year is null or f.from_year<=extract(year from current_date)) and (f.to_year is null or f.to_year>=extract(year from current_date)) offset 0) f
  join reference.countries c on c.id=$1
  join reference.values k on k.id=f.feature_type_id
  left join lateral (select n.name,l.iso6391 as language_code from geography.names n left join reference.languages l on l.id=n.language_id
    where n.feature_id=f.id and n.deleted_at is null order by (l.iso6391=$2) desc nulls last,n.is_default desc,n.id limit 1) n on true
  left join lateral (select l.label from reference.value_labels l join reference.languages lang on lang.id=l.language_id
    where l.value_id=k.id and lang.iso6391=$2 and l.deleted_at is null order by l.id limit 1) vl on true
)`;
export const placeColumns = `p.feature_id as "featureId",p.code,p.country_code as "countryCode",p.name,p.language_code as "nameLanguage",p.kind,
  p.path as "canonicalPath",cardinality(p.segments)::int as depth,p.parent_feature_id as "parentFeatureId",
  (select count(*)::int from source.citations c where c.subject_table='geography.features' and c.subject_id=p.feature_id and c.deleted_at is null) as "citationCount"`;
