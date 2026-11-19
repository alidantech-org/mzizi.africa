-- Structure proof: two countries, pattern expansion, seat rules, a multi-step power.
do $$
declare
  ke uuid; za uuid; kef uuid; zaf uuid; lk1 uuid; lz1 uuid; c record; i int;
  pat uuid; t_inst uuid; t_off uuid; ent uuid; inst uuid; par_inst uuid; par_ent uuid; pos uuid; off uuid;
  jsc_e uuid; jsc uuid; na_e uuid; na uuid; pres_e uuid; pres uuid; jud_e uuid; jud uuid; p_pres uuid; p_judge uuid; proc uuid; zi uuid; zi_e uuid; p_prem uuid;
begin
  ke := t.mk('reference.countries', jsonb_build_object('code','ke','name','Kenya','is_served',true));
  za := t.mk('reference.countries', jsonb_build_object('code','za','name','South Africa','is_served',false));
  kef := t.mk('geography.features', jsonb_build_object('code','ke','feature_type_id',t.val('geo.feature.kind.country')));
  zaf := t.mk('geography.features', jsonb_build_object('code','za','feature_type_id',t.val('geo.feature.kind.country')));
  perform t.mk('geography.levels', jsonb_build_object('code','ke.level.electoral.0','country_id',ke,'hierarchy_kind_id',t.val('geo.hierarchy.kind.electoral'),'depth',0,'feature_kind_id',t.val('geo.feature.kind.country'),'is_routing_hierarchy',true,'root_feature_id',kef));
  lk1 := t.mk('geography.levels', jsonb_build_object('code','ke.level.electoral.1','country_id',ke,'hierarchy_kind_id',t.val('geo.hierarchy.kind.electoral'),'depth',1,'feature_kind_id',t.val('geo.feature.kind.county'),'is_routing_hierarchy',true));
  perform t.mk('geography.levels', jsonb_build_object('code','za.level.electoral.0','country_id',za,'hierarchy_kind_id',t.val('geo.hierarchy.kind.electoral'),'depth',0,'feature_kind_id',t.val('geo.feature.kind.country'),'is_routing_hierarchy',true,'root_feature_id',zaf));
  lz1 := t.mk('geography.levels', jsonb_build_object('code','za.level.electoral.1','country_id',za,'hierarchy_kind_id',t.val('geo.hierarchy.kind.electoral'),'depth',1,'feature_kind_id',t.val('geo.feature.kind.province'),'is_routing_hierarchy',true));
  for i in 1..3 loop perform t.mk('geography.features', jsonb_build_object('code','ke.c'||i,'feature_type_id',t.val('geo.feature.kind.county'))); end loop;
  for i in 1..2 loop perform t.mk('geography.features', jsonb_build_object('code','za.p'||i,'feature_type_id',t.val('geo.feature.kind.province'))); end loop;

  -- collective parent institution for the Governor position (Kenya)
  par_ent := t.mk('official.entities', jsonb_build_object('code','ke.county-governments','kind_id',t.val('ofc.entity.kind.institution')));
  par_inst := t.mk('governance.institutions', jsonb_build_object('code','ke.county-governments','country_id',ke,'entity_id',par_ent,'institution_kind_id',t.val('gov.institution.kind.county-government')));
  pos := t.mk('governance.positions', jsonb_build_object('code','ke.governor','institution_id',par_inst,'role_id',t.val('gov.position.role.head'),'selection_method_id',t.val('gov.selection.method.direct-election'),'seat_basis_id',t.val('gov.seat.basis.per-unit'),'jurisdiction_level_id',lk1,'seat_unit_level_id',lk1,'term_years',5,'term_limit',2,'exposure_id',t.val('gov.exposure.level.top')));

  -- pattern and templates
  pat := t.mk('reference.patterns', jsonb_build_object('code','ke.county-government','title','County government','kind_id',t.val('gov.pattern.kind.institution-set'),'country_id',ke));
  t_inst := t.mk('reference.templates', jsonb_build_object('code','county-government','pattern_id',pat,'produces','institution','fan_out_level_id',lk1,'name_template','{place.name} County Government','code_template','ke.{place.slug}.government'));
  t_off := t.mk('reference.templates', jsonb_build_object('code','governor-seat','pattern_id',pat,'produces','office','fan_out_level_id',lk1,'parent_template_id',t_inst,'name_template','Governor, {place.name}','code_template','ke.{place.slug}.governor','role_id',t.val('gov.position.role.head'),'selection_method_id',t.val('gov.selection.method.direct-election')));

  -- expand over every county feature (what the engine operation would do), expected status only
  for c in select f.id, f.code from geography.features f where f.feature_type_id = t.val('geo.feature.kind.county') order by f.code loop
    ent := t.mk('official.entities', jsonb_build_object('code',c.code||'.government','kind_id',t.val('ofc.entity.kind.institution')));
    inst := t.mk('governance.institutions', jsonb_build_object('code',c.code||'.government','country_id',ke,'entity_id',ent,'institution_kind_id',t.val('gov.institution.kind.county-government')));
    perform t.mk('reference.instances', jsonb_build_object('template_id',t_inst,'unit_feature_id',c.id,'institution_id',inst,'status_id',t.val('ref.evidence.status.expected'),'generated_at',now()));
    off := t.mk('governance.offices', jsonb_build_object('code',c.code||'.governor','institution_id',par_inst,'position_id',pos,'unit_feature_id',c.id));
    perform t.mk('reference.instances', jsonb_build_object('template_id',t_off,'unit_feature_id',c.id,'office_id',off,'status_id',t.val('ref.evidence.status.expected'),'generated_at',now()));
  end loop;
  -- one record gets verified
  update reference.instances set status_id = t.val('ref.evidence.status.verified') where office_id = t.id('governance.offices','ke.c1.governor');

  -- second country: provinces whose premier is chosen by the legislature (indirect election); only 1 of 2 seats created
  zi_e := t.mk('official.entities', jsonb_build_object('code','za.provincial-governments','kind_id',t.val('ofc.entity.kind.institution')));
  zi := t.mk('governance.institutions', jsonb_build_object('code','za.provincial-governments','country_id',za,'entity_id',zi_e,'institution_kind_id',t.val('gov.institution.kind.county-government')));
  p_prem := t.mk('governance.positions', jsonb_build_object('code','za.premier','institution_id',zi,'role_id',t.val('gov.position.role.head'),'selection_method_id',t.val('gov.selection.method.indirect-election'),'seat_basis_id',t.val('gov.seat.basis.per-unit'),'jurisdiction_level_id',lz1,'seat_unit_level_id',lz1,'term_years',5));
  perform t.mk('governance.offices', jsonb_build_object('code','za.p1.premier','institution_id',zi,'position_id',p_prem,'unit_feature_id',t.id('geography.features','za.p1')));

  -- national bodies and a multi-step procedure (appoint a judge)
  pres_e := t.mk('official.entities', jsonb_build_object('code','ke.presidency','kind_id',t.val('ofc.entity.kind.institution')));
  pres := t.mk('governance.institutions', jsonb_build_object('code','ke.presidency','country_id',ke,'entity_id',pres_e,'institution_kind_id',t.val('gov.institution.kind.independent-office')));
  jsc_e := t.mk('official.entities', jsonb_build_object('code','ke.judicial-service-commission','kind_id',t.val('ofc.entity.kind.institution')));
  jsc := t.mk('governance.institutions', jsonb_build_object('code','ke.judicial-service-commission','country_id',ke,'entity_id',jsc_e,'institution_kind_id',t.val('gov.institution.kind.commission')));
  na_e := t.mk('official.entities', jsonb_build_object('code','ke.national-assembly','kind_id',t.val('ofc.entity.kind.institution')));
  na := t.mk('governance.institutions', jsonb_build_object('code','ke.national-assembly','country_id',ke,'entity_id',na_e,'institution_kind_id',t.val('gov.institution.kind.legislature')));
  jud_e := t.mk('official.entities', jsonb_build_object('code','ke.judiciary','kind_id',t.val('ofc.entity.kind.institution')));
  jud := t.mk('governance.institutions', jsonb_build_object('code','ke.judiciary','country_id',ke,'entity_id',jud_e,'institution_kind_id',t.val('gov.institution.kind.court')));
  p_pres := t.mk('governance.positions', jsonb_build_object('code','ke.president','institution_id',pres,'role_id',t.val('gov.position.role.head'),'selection_method_id',t.val('gov.selection.method.direct-election'),'seat_basis_id',t.val('gov.seat.basis.fixed'),'seat_count',1,'term_years',5,'term_limit',2));
  p_judge := t.mk('governance.positions', jsonb_build_object('code','ke.judge','institution_id',jud,'role_id',t.val('gov.position.role.adjudicator'),'selection_method_id',t.val('gov.selection.method.appointment'),'seat_basis_id',t.val('gov.seat.basis.variable')));
  proc := t.mk('governance.procedures', jsonb_build_object('code','ke.appoint-judge','country_id',ke,'kind_id',t.val('gov.procedure.kind.appointment'),'description','A judge is recommended, appointed and approved.'));
  perform t.mk('governance.powers', jsonb_build_object('code','ke.appoint-judge.1','holder_institution_id',jsc,'target_position_id',p_judge,'kind_id',t.val('gov.power.kind.nominate'),'procedure_id',proc,'step_order',1,'is_binding',true));
  perform t.mk('governance.powers', jsonb_build_object('code','ke.appoint-judge.2','holder_position_id',p_pres,'target_position_id',p_judge,'kind_id',t.val('gov.power.kind.appoint'),'procedure_id',proc,'step_order',2,'is_binding',true));
  perform t.mk('governance.powers', jsonb_build_object('code','ke.appoint-judge.3','holder_institution_id',na,'target_position_id',p_judge,'kind_id',t.val('gov.power.kind.approve'),'procedure_id',proc,'step_order',3,'is_binding',false));
end $$;
