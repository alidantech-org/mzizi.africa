\echo '== 1. Completeness meter: expected vs verified per template'
select tp.code as template, count(*) as total,
       count(*) filter (where s.code like '%.expected') as expected,
       count(*) filter (where s.code like '%.verified') as verified
from reference.instances i join reference.templates tp on tp.id=i.template_id join reference.values s on s.id=i.status_id
group by tp.code order by 1;

\echo '== 2. Seat rule check: per-unit positions, expected seats vs office rows, vacancy'
select p.code as position, c.code as country, count(distinct f.id) as expected_seats, count(distinct o.id) as office_rows,
       count(distinct f.id) - count(distinct o.id) as missing_offices,
       count(distinct o.id) filter (where not exists (select 1 from governance.holders h where h.office_id=o.id and h.deleted_at is null)) as vacant_or_unknown
from governance.positions p
join geography.levels l on l.id = p.seat_unit_level_id
join reference.countries c on c.id = l.country_id
join geography.features f on f.feature_type_id = l.feature_kind_id and f.code like c.code||'.%' and f.deleted_at is null
left join governance.offices o on o.position_id = p.id and o.deleted_at is null
group by p.code, c.code order by 1;

\echo '== 3. Chain for appointing a judge, in step order'
select pw.step_order, vk.label as right, coalesce(hi.code, hp.code) as holder, coalesce(ti.code, tp.code) as target, pw.is_binding
from governance.powers pw
join governance.procedures pr on pr.id=pw.procedure_id and pr.code='ke.appoint-judge'
join reference.values vk on vk.id=pw.kind_id
left join governance.institutions hi on hi.id=pw.holder_institution_id
left join governance.positions hp on hp.id=pw.holder_position_id
left join governance.institutions ti on ti.id=pw.target_institution_id
left join governance.positions tp on tp.id=pw.target_position_id
order by pw.step_order;

\echo '== 4. National figure resolves for any country through levels.root_feature_id'
select c.code, f.code as root_feature from geography.levels l join reference.countries c on c.id=l.country_id join geography.features f on f.id=l.root_feature_id where l.depth=0 order by 1;

\echo '== 5. Constraint checks (each must fail)'
\set ON_ERROR_STOP off
select t.mk('reference.instances', jsonb_build_object('template_id',(select id from reference.templates limit 1),'status_id',t.val('ref.evidence.status.expected'),'generated_at',now()));
select t.mk('governance.powers', jsonb_build_object('code','bad.power','kind_id',t.val('gov.power.kind.appoint'),'is_binding',true,'holder_position_id',(select id from governance.positions limit 1),'holder_institution_id',(select id from governance.institutions limit 1),'target_position_id',(select id from governance.positions limit 1)));
select t.mk('governance.offices', jsonb_build_object('code','bad.office','institution_id',(select id from governance.institutions limit 1)));
select t.mk('reference.templates', jsonb_build_object('code','dup','pattern_id',(select id from reference.patterns limit 1),'produces','sandwich','name_template','x','code_template','y'));
