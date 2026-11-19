-- Read-only acceptance checks for the deterministic governance web fixtures.
\set ON_ERROR_STOP on
begin read only;
do $$
declare n integer; methods integer;
begin
  select count(*), count(distinct p.selection_method_id) into n, methods
  from governance.positions p join governance.institutions i on i.id=p.institution_id
  join reference.countries c on c.id=i.country_id
  where p.code like 'gov.pos.dev.web.%' and p.code not like 'gov.pos.dev.web.za.%' and c.iso_alpha2='KE';
  if n<>5 or methods<>5 then raise exception 'Expected five distinct Kenya demonstration selection methods, got % positions / % methods',n,methods; end if;
  select count(*) into n from governance.offices where code like 'gov.ofs.dev.web.%' and code not like 'gov.ofs.dev.web.za.%';
  if n<>10 then raise exception 'Expected ten Kenya demonstration seats, got %',n; end if;
  select count(*) into n from governance.offices o join governance.positions p on p.id=o.position_id
  where o.code like 'gov.ofs.dev.web.%' and (o.institution_id<>p.institution_id or o.seat_ordinal is null);
  if n<>0 then raise exception 'Fixture office identity is inconsistent'; end if;
  select count(*) into n from governance.institutions i join reference.countries c on c.id=i.country_id
  where i.code='gov.ins.dev.web.za.council' and c.iso_alpha2='ZA';
  if n<>1 then raise exception 'South Africa demonstration is missing or assigned to another country'; end if;
  select count(*) into n from governance.powers where code in ('gov.pwr.dev.web.approve','gov.pwr.dev.web.appoint');
  if n<>2 then raise exception 'Expected separate approval and appointment records'; end if;
  select count(*) into n from geography.levels l join reference.countries c on c.id=l.country_id
  where c.iso_alpha2 in ('KE','ZA') and l.depth=0 and l.is_routing_hierarchy and l.root_feature_id is not null;
  if n<2 then raise exception 'Both country routing roots must be recorded'; end if;
end $$;
rollback;
