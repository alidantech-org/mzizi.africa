create schema if not exists t;
create or replace function t.mk(tbl regclass, data jsonb) returns uuid language plpgsql as $$
declare newid uuid := coalesce((data->>'id')::uuid, gen_random_uuid()); cols text; vals text;
begin
  data := jsonb_build_object('id',newid,'version',1,'created_at',now(),'updated_at',now()) || data;
  execute format('insert into %s select * from jsonb_populate_record(null::%s, $1)', tbl, tbl) using data;
  return newid;
end $$;
create or replace function t.val(vcode text) returns uuid language plpgsql as $$
declare sc text := 'ref.sch.'||regexp_replace(vcode,'\.[^.]+$',''); fv text := 'ref.val.'||vcode; sid uuid; vid uuid;
begin
  select id into sid from reference.schemes where code=sc;
  if sid is null then sid := t.mk('reference.schemes', jsonb_build_object('code',sc,'title',sc,'owner_snapshot','test')); end if;
  select id into vid from reference.values where code=fv;
  if vid is null then vid := t.mk('reference.values', jsonb_build_object('code',fv,'label',vcode,'scheme_id',sid)); end if;
  return vid;
end $$;
create or replace function t.id(tbl regclass, c text) returns uuid language plpgsql as $$
declare r uuid; begin execute format('select id from %s where code=$1', tbl) into r using c; return r; end $$;
