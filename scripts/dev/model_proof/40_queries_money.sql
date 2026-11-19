select t.mk('governance.authority_scopes', jsonb_build_object('institution_id',t.id('governance.institutions','ke.c1.government'),'unit_feature_id',t.id('geography.features','ke.c1'),'authority_kind_id',t.val('gov.authority.kind.administers'))) is not null as scope_added;

\echo '== A. Supplier concentration per buyer (share of contract value, incl. variations)'
with v as (select c.id, c.contractor_entity_id, c.buyer_entity_id, c.amount_minor_units + coalesce((select sum(amount_delta_minor_units) from civic.variations x where x.contract_id=c.id),0) as total from civic.contracts c)
select be.code as buyer, ce.code as supplier, sum(total) as value, round(100.0*sum(total)/sum(sum(total)) over (partition by be.code),1) as pct_share
from v join official.entities be on be.id=v.buyer_entity_id join official.entities ce on ce.id=v.contractor_entity_id group by be.code, ce.code order by pct_share desc;

\echo '== B. Award vs estimate and single-bid flag'
select p.code, p.estimated_amount_minor_units as estimate, c.amount_minor_units as awarded, round(100.0*c.amount_minor_units/p.estimated_amount_minor_units,1) as pct_of_estimate, p.bidder_count, (p.bidder_count=1) as single_bidder
from civic.procurements p join civic.contracts c on c.procurement_id=p.id;

\echo '== C. Signal: office holder (in office on signing date) owns a supplier of a body that holds authority over the holder''s unit - PUBLISHABLE (verified ties only)'
select i.code as person, o.code as office, e.code as supplier, r.share_percentage, c.code as contract, c.signed_on, ev.label as evidence
from governance.holders h
join official.individuals i on i.id=h.individual_id
join governance.offices o on o.id=h.office_id
join official.relationships r on r.from_individual_id=i.id and r.kind_id in (select id from reference.values where code like 'ref.val.ofc.relationship.kind.%')
join official.entities e on e.id=r.to_entity_id
join civic.contracts c on c.contractor_entity_id=e.id
join governance.institutions bi on bi.entity_id=c.buyer_entity_id
join governance.authority_scopes s on s.institution_id=bi.id and s.unit_feature_id=o.unit_feature_id
join reference.values ev on ev.id=r.evidence_status_id
where (h.took_office_on is null or h.took_office_on <= c.signed_on) and (h.left_office_on is null or h.left_office_on >= c.signed_on)
  and (r.starts_on is null or r.starts_on <= c.signed_on)
  and ev.code='ref.val.ref.evidence.status.verified';

\echo '== C2. Same signal including unreviewed ties (what a reviewer sees, never published)'
select e.code as supplier, r.share_percentage, ev.label as evidence_status, bs.label as basis, r.confidence
from official.relationships r join official.entities e on e.id=r.to_entity_id join reference.values ev on ev.id=r.evidence_status_id join reference.values bs on bs.id=r.evidence_basis_id order by r.confidence desc;

\echo '== D. Signal: supplier gave to a party within 365 days before an award'
select e.code as donor, pr.code as party, g.given_on, c.signed_on, (c.signed_on - g.given_on) as days_before_award, g.amount_minor_units as gift
from politics.contributions g join official.entities e on e.id=g.donor_entity_id join politics.parties pr on pr.id=g.recipient_party_id
join civic.contracts c on c.contractor_entity_id=e.id where c.signed_on between g.given_on and g.given_on + 365 order by days_before_award;

\echo '== E. Joint venture and signatory of contract 1'
select ce.code as party, pr.label as role, p.share_percentage from civic.partners p join official.entities ce on ce.id=p.partner_entity_id join reference.values pr on pr.id=p.role_id join civic.contracts c on c.id=p.contract_id and c.code='test.ctr.1';
select i.code as signatory, o.code as office, r.label as role from civic.officials f join official.individuals i on i.id=f.individual_id join reference.values r on r.id=f.role_id join governance.offices o on o.id=f.office_id;

\echo '== F. Promise: status, media (recording moment), content, links, coverage behind "no record found"'
select p.code, st.label as status, p.status_as_of, p.statement from governance.promises p join reference.values st on st.id=p.status_id;
select m.title, m.external_url, m.start_second, m.end_second from filesystem.media m join governance.promises p on p.id=m.subject_id and m.subject_table='governance.promises';
select c.title, left(c.body,30) as body from filesystem.contents c join governance.promises p on p.id=c.subject_id and c.subject_table='governance.promises';
select k.label as link_kind, ev.label as evidence, pj.code as project from governance.fulfilments f join reference.values k on k.id=f.kind_id join reference.values ev on ev.id=f.evidence_status_id join civic.projects pj on pj.id=f.project_id;
select cv.code, lv.label as coverage_level, cv.checked_on from source.coverage cv join reference.values lv on lv.id=cv.level_id;

\echo '== G. Dispute with both claims kept; right of reply beside the contract'
select d.summary, ct.position, ct.claim, ct.is_preferred from source.disputes d join source.contenders ct on ct.dispute_id=d.id order by ct.position;
select r.id is not null as reply_exists, s.label as reply_status, c.title from community.replies r join reference.values s on s.id=r.status_id join filesystem.contents c on c.id=r.content_id;

\echo '== H. Candidate hosts that are not sources yet'
select d.host, st.label as status, en.code as entity from source.domains d join reference.values st on st.id=d.status_id left join official.entities en on en.id=d.entity_id where d.source_id is null;

\echo '== I. As-of lookup: who held the Governor office of county 1 on two dates'
select d::date as as_of, (select i.code from governance.holders h join official.individuals i on i.id=h.individual_id where h.office_id=t.id('governance.offices','ke.c1.governor') and (h.took_office_on is null or h.took_office_on<=d) and (h.left_office_on is null or h.left_office_on>=d)) as holder
from (values ('2022-08-20'::date),('2022-08-27'::date),('2026-01-01'::date)) x(d);
