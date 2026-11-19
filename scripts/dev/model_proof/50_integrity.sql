-- Transactional regression proof for generated constraints. No fixture rows survive.
\set ON_ERROR_STOP on
begin;
\ir 00_helpers.sql

do $$
declare
  nation uuid; body uuid; other_body uuid; person_entity uuid; other_entity uuid;
  pos uuid; pat uuid; unit uuid; rejected boolean;
begin
  nation := t.mk('reference.countries', jsonb_build_object('code','integrity.country','name','Synthetic integrity fixture','is_served',false));
  person_entity := t.mk('official.entities', jsonb_build_object('code','integrity.body','kind_id',t.val('ofc.entity.kind.institution')));
  other_entity := t.mk('official.entities', jsonb_build_object('code','integrity.other','kind_id',t.val('ofc.entity.kind.institution')));
  body := t.mk('governance.institutions', jsonb_build_object('code','integrity.body','country_id',nation,'entity_id',person_entity,'institution_kind_id',t.val('gov.institution.kind.commission')));
  other_body := t.mk('governance.institutions', jsonb_build_object('code','integrity.other','country_id',nation,'entity_id',other_entity,'institution_kind_id',t.val('gov.institution.kind.commission')));
  pos := t.mk('governance.positions', jsonb_build_object('code','integrity.member','institution_id',body,'title_id',t.val('gov.position.title.member'),'role_id',t.val('gov.position.role.member'),'selection_method_id',t.val('gov.selection.method.ex-officio'),'seat_basis_id',t.val('gov.seat.basis.fixed'),'seat_count',2));
  unit := t.mk('geography.features', jsonb_build_object('code','integrity.unit','feature_type_id',t.val('geo.feature.kind.county')));
  perform t.mk('governance.offices', jsonb_build_object('code','integrity.seat.one','institution_id',body,'position_id',pos,'unit_feature_id',unit,'seat_ordinal',1));
  perform t.mk('governance.offices', jsonb_build_object('code','integrity.seat.two','institution_id',body,'position_id',pos,'unit_feature_id',unit,'seat_ordinal',2));
  rejected := false;
  begin
    perform t.mk('governance.offices', jsonb_build_object('code','integrity.duplicate','institution_id',body,'position_id',pos,'unit_feature_id',unit,'seat_ordinal',1));
  exception when unique_violation then rejected := true;
  end;
  if not rejected then raise exception 'Duplicate numbered seat was accepted'; end if;
  rejected := false;
  begin
    perform t.mk('governance.offices', jsonb_build_object('code','integrity.wrongbody','institution_id',other_body,'position_id',pos,'seat_ordinal',1));
  exception when foreign_key_violation then rejected := true;
  end;
  if not rejected then raise exception 'Office and position institution mismatch was accepted'; end if;
  pat := t.mk('reference.patterns', jsonb_build_object('code','integrity.pattern','title','Synthetic pattern','kind_id',t.val('gov.pattern.kind.structure'),'country_id',nation));
  rejected := false;
  begin
    perform t.mk('reference.templates', jsonb_build_object('code','integrity.invalidproduct','pattern_id',pat,'produces','sandwich','name_template','Synthetic','code_template','synthetic'));
  exception when check_violation then rejected := true;
  end;
  if not rejected then raise exception 'Undeclared template product was accepted'; end if;
  rejected := false;
  begin
    perform t.mk('reference.templates', jsonb_build_object('code','integrity.wrongattributes','pattern_id',pat,'produces','domain','name_template','Synthetic','code_template','synthetic','role_id',t.val('gov.position.role.member')));
  exception when check_violation then rejected := true;
  end;
  if not rejected then raise exception 'Position-only attributes were accepted on a domain'; end if;
  raise notice 'PASS: enum, template attributes, numbered seats and office/position institution constraints';
end $$;
rollback;
