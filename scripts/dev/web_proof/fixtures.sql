-- Idempotent synthetic web fixtures. Run only against an explicitly selected development database.
\set ON_ERROR_STOP on
begin;
create schema if not exists web_fixture;
create or replace function web_fixture.put(tbl regclass, payload jsonb) returns uuid language plpgsql as $$
declare identity uuid; code_value text := payload->>'code';
begin
  if code_value is null then raise exception 'A web fixture requires a stable code'; end if;
  execute format('select id from %s where code=$1',tbl) into identity using code_value;
  if identity is not null then return identity; end if;
  identity := md5(tbl::text||':'||code_value)::uuid;
  payload := jsonb_build_object('id',identity,'version',1,'created_at',now(),'updated_at',now()) || payload;
  execute format('insert into %s select * from jsonb_populate_record(null::%s,$1)',tbl,tbl) using payload;
  return identity;
end $$;
create or replace function web_fixture.value(scheme_code text, value_code text, label_text text) returns uuid language plpgsql as $$
declare scheme uuid;
begin
  scheme := web_fixture.put('reference.schemes',jsonb_build_object('code','ref.sch.'||scheme_code,'title',scheme_code,'owner_snapshot','Synthetic web proof'));
  return web_fixture.put('reference.values',jsonb_build_object('code','ref.val.'||scheme_code||'.dev.'||value_code,'scheme_id',scheme,'label',label_text));
end $$;

do $$
declare
  ke uuid; za uuid; root_ke uuid; root_za uuid; lang uuid; body uuid; body_entity uuid;
  position uuid; other_position uuid; procedure uuid; function_id uuid; term_method uuid; method text; title uuid;
  kind uuid; role uuid; fixed uuid; power_kind uuid; share_kind uuid; j int;
begin
  select id into ke from reference.countries where iso_alpha2='KE';
  select id into za from reference.countries where iso_alpha2='ZA';
  select id into lang from reference.languages where iso6391='en';
  if ke is null or za is null or lang is null then raise exception 'Load the approved country/language inputs before web fixtures'; end if;
  select id into root_ke from geography.features where code='geo.ftr.ke';
  root_za := web_fixture.put('geography.features',jsonb_build_object('code','geo.ftr.dev.za','feature_type_id',web_fixture.value('geo.feature.kind','country','Country')));
  update geography.levels set root_feature_id=root_ke where country_id=ke and depth=0 and root_feature_id is null;
  perform web_fixture.put('geography.levels',jsonb_build_object('code','geo.lvl.dev.za.routing','country_id',za,'hierarchy_kind_id',web_fixture.value('geo.hierarchy.kind','routing','Routing hierarchy'),'depth',0,'feature_kind_id',web_fixture.value('geo.feature.kind','country','Country'),'is_routing_hierarchy',true,'root_feature_id',root_za));
  kind := web_fixture.value('ofc.entity.kind','institution','Demonstration institution');
  body_entity := web_fixture.put('official.entities',jsonb_build_object('code','ofc.ent.dev.web.council','kind_id',kind));
  body := web_fixture.put('governance.institutions',jsonb_build_object('code','gov.ins.dev.web.council','country_id',ke,'entity_id',body_entity,'institution_kind_id',web_fixture.value('gov.institution.kind','council','Demonstration council'),'arm_id',web_fixture.value('gov.arm','demonstration','Demonstration governance')));
  if not exists(select 1 from official.names where entity_id=body_entity) then
    insert into official.names(id,version,created_at,updated_at,entity_id,name,language_id,name_kind_id,is_preferred)
    values(md5('web.council.name')::uuid,1,now(),now(),body_entity,'Demonstration Public Services Council',lang,web_fixture.value('ofc.name.kind','preferred','Preferred'),true);
  end if;
  role := web_fixture.value('gov.position.role','member','Member');
  fixed := web_fixture.value('gov.seat.basis','fixed','Fixed seats');
  title := web_fixture.value('gov.position.title','member','Demonstration council member');
  j := 0;
  foreach method in array array['direct-election','indirect-election','nominated','appointed','ex-officio'] loop
    j := j+1;
    term_method := web_fixture.value('gov.selection.method',method,replace(initcap(replace(method,'-',' ')),'Ex Officio','Ex officio'));
    position := web_fixture.put('governance.positions',jsonb_build_object('code','gov.pos.dev.web.'||replace(method,'-','.'),'institution_id',body,'title_id',title,'role_id',role,'selection_method_id',term_method,'seat_basis_id',fixed,'seat_count',2,'term_years',5,'display_order',j));
    perform web_fixture.put('governance.offices',jsonb_build_object('code','gov.ofs.dev.web.'||replace(method,'-','.')||'.one','institution_id',body,'position_id',position,'unit_feature_id',root_ke,'seat_ordinal',1));
    perform web_fixture.put('governance.offices',jsonb_build_object('code','gov.ofs.dev.web.'||replace(method,'-','.')||'.two','institution_id',body,'position_id',position,'unit_feature_id',root_ke,'seat_ordinal',2));
    if j=1 then other_position:=position; end if;
  end loop;
  procedure := web_fixture.put('governance.procedures',jsonb_build_object('code','gov.prc.dev.web.appointment','country_id',ke,'kind_id',web_fixture.value('gov.procedure.kind','appointment','Appointment'),'description','Synthetic procedure: nomination, approval and appointment are separate formal steps, not reporting lines.'));
  power_kind := web_fixture.value('gov.power.kind','approve','Approve');
  perform web_fixture.put('governance.powers',jsonb_build_object('code','gov.pwr.dev.web.approve','holder_position_id',other_position,'target_position_id',position,'kind_id',power_kind,'procedure_id',procedure,'step_order',2,'is_binding',false));
  perform web_fixture.put('governance.powers',jsonb_build_object('code','gov.pwr.dev.web.appoint','holder_institution_id',body,'target_position_id',position,'kind_id',web_fixture.value('gov.power.kind','appoint','Appoint'),'procedure_id',procedure,'step_order',3,'is_binding',true));
  function_id := web_fixture.put('governance.functions',jsonb_build_object('code','gov.fnc.dev.web.public.services','country_id',ke));
  share_kind := web_fixture.value('gov.responsibility.share','shared','Shared responsibility');
  perform web_fixture.put('governance.assignments',jsonb_build_object('code','gov.asn.dev.web.services','function_id',function_id,'institution_id',body,'share_id',share_kind,'start_institution_id',body));
  body_entity := web_fixture.put('official.entities',jsonb_build_object('code','ofc.ent.dev.web.za.council','kind_id',kind));
  body := web_fixture.put('governance.institutions',jsonb_build_object('code','gov.ins.dev.web.za.council','country_id',za,'entity_id',body_entity,'institution_kind_id',web_fixture.value('gov.institution.kind','council','Demonstration council'),'arm_id',web_fixture.value('gov.arm','demonstration','Demonstration governance')));
  if not exists(select 1 from official.names where entity_id=body_entity) then
    insert into official.names(id,version,created_at,updated_at,entity_id,name,language_id,name_kind_id,is_preferred)
    values(md5('web.za.council.name')::uuid,1,now(),now(),body_entity,'Demonstration Provincial Council',lang,web_fixture.value('ofc.name.kind','preferred','Preferred'),true);
  end if;
  position := web_fixture.put('governance.positions',jsonb_build_object('code','gov.pos.dev.web.za.premier','institution_id',body,'title_id',web_fixture.value('gov.position.title','premier','Demonstration premier'),'role_id',role,'selection_method_id',web_fixture.value('gov.selection.method','indirect-election','Indirect election'),'seat_basis_id',fixed,'seat_count',1,'term_years',5));
  perform web_fixture.put('governance.offices',jsonb_build_object('code','gov.ofs.dev.web.za.premier','institution_id',body,'position_id',position,'unit_feature_id',root_za,'seat_ordinal',1));
  insert into geography.names(id,version,created_at,updated_at,feature_id,name,language_id,name_kind_id,is_default)
  values(md5('web.za.root.name')::uuid,1,now(),now(),root_za,'South Africa · demonstration',lang,web_fixture.value('geo.name.kind','preferred','Preferred'),true)
  on conflict(id) do nothing;
end $$;
commit;
