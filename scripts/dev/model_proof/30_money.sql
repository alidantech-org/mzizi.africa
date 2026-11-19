delete from reference.templates where code='dup';
do $$
declare
  ke uuid := t.id('reference.countries','ke');
  c1gov_e uuid := t.id('official.entities','ke.c1.government');
  person uuid; pa uuid; acme uuid; bolt uuid; party_e uuid; party uuid; gov_off uuid; hold uuid; proc uuid; ctr uuid; ctr2 uuid;
  cit uuid; cit2 uuid; prom uuid; proj uuid; lang uuid; cont uuid; pub uuid; src uuid; disp uuid; reply_c uuid; gov_c1_e uuid;
  tpl uuid; dom uuid; contact uuid; dom0 uuid; addr uuid;
begin
  -- publisher/source for coverage
  pub := t.mk('source.publishers', jsonb_build_object('code','test.pub','name','Test publisher','kind_id',t.val('src.publisher.kind.government')));
  src := t.mk('source.sources', jsonb_build_object('code','test.src','publisher_id',pub,'kind','website','title','Test portal','licence_id',t.val('src.licence.open'),'terms_url','https://example.org/terms'));
  dom0 := t.mk('source.domains', jsonb_build_object('code','test.portal','source_id',src,'host','portal.example.org','status_id',t.val('src.domain.status.verified-official')));
  addr := t.mk('source.addresses', jsonb_build_object('code','test.addr','domain_id',dom0,'kind','page','method','GET','path','/records'));
  cit  := t.mk('source.citations', jsonb_build_object('code','test.cit.1','address_id',addr,'locator','p.1','locator_kind_id',t.val('src.locator.kind.page'),'recorded_at',now()));
  cit2 := t.mk('source.citations', jsonb_build_object('code','test.cit.2','address_id',addr,'locator','p.9','locator_kind_id',t.val('src.locator.kind.page'),'recorded_at',now()));
  person := t.mk('official.individuals', jsonb_build_object('code','test.person-a'));
  acme := t.mk('official.entities', jsonb_build_object('code','test.acme-ltd','kind_id',t.val('ofc.entity.kind.company')));
  bolt := t.mk('official.entities', jsonb_build_object('code','test.bolt-ltd','kind_id',t.val('ofc.entity.kind.company')));
  -- person-a holds the Governor office of county 1
  gov_off := t.id('governance.offices','ke.c1.governor');
  hold := t.mk('governance.holders', jsonb_build_object('code','test.hold.1','office_id',gov_off,'individual_id',person,'appointment_kind_id',t.val('gov.selection.method.direct-election'),'took_office_on','2022-08-25','from_year',2022));
  -- graded ownership: person-a owns 60% of Acme (registry record, verified) and an unreviewed match for Bolt (inferred)
  perform t.mk('official.relationships', jsonb_build_object('code','test.own.1','from_individual_id',person,'to_entity_id',acme,'kind_id',t.val('ofc.relationship.kind.shareholder'),'share_percentage',60,'starts_on','2019-01-01','evidence_basis_id',t.val('ref.evidence.basis.registry-record'),'evidence_status_id',t.val('ref.evidence.status.verified'),'confidence',1));
  perform t.mk('official.relationships', jsonb_build_object('code','test.own.2','from_individual_id',person,'to_entity_id',bolt,'kind_id',t.val('ofc.relationship.kind.shareholder'),'share_percentage',10,'evidence_basis_id',t.val('ref.evidence.basis.inferred-by-matching'),'evidence_status_id',t.val('ref.evidence.status.sourced'),'confidence',0.55));
  -- procurement and contracts: Acme (lead) with Bolt (subcontractor), a direct award with no procurement
  proc := t.mk('civic.procurements', jsonb_build_object('code','test.proc.1','buyer_entity_id',c1gov_e,'procedure_kind_id',t.val('civ.procedure.kind.open'),'estimated_amount_minor_units',90000000,'currency_id',t.val('fin.currency.kes'),'bidder_count',1,'awarded_on','2023-03-01'));
  ctr := t.mk('civic.contracts', jsonb_build_object('code','test.ctr.1','procurement_id',proc,'contractor_entity_id',acme,'buyer_entity_id',c1gov_e,'amount_minor_units',100000000,'currency_id',t.val('fin.currency.kes'),'status_id',t.val('civ.contract.status.active'),'signed_on','2023-03-10'));
  ctr2 := t.mk('civic.contracts', jsonb_build_object('code','test.ctr.2','contractor_entity_id',acme,'buyer_entity_id',c1gov_e,'amount_minor_units',50000000,'currency_id',t.val('fin.currency.kes'),'status_id',t.val('civ.contract.status.active'),'signed_on','2023-09-01'));
  perform t.mk('civic.contracts', jsonb_build_object('code','test.ctr.3','contractor_entity_id',bolt,'buyer_entity_id',c1gov_e,'amount_minor_units',10000000,'currency_id',t.val('fin.currency.kes'),'status_id',t.val('civ.contract.status.active'),'signed_on','2023-10-01'));
  perform t.mk('civic.partners', jsonb_build_object('contract_id',ctr,'partner_entity_id',acme,'role_id',t.val('civ.partner.role.lead'),'share_percentage',70));
  perform t.mk('civic.partners', jsonb_build_object('contract_id',ctr,'partner_entity_id',bolt,'role_id',t.val('civ.partner.role.subcontractor'),'share_percentage',30));
  perform t.mk('civic.variations', jsonb_build_object('code','test.var.1','contract_id',ctr,'kind_id',t.val('civ.variation.kind.extension'),'amount_delta_minor_units',15000000,'currency_id',t.val('fin.currency.kes'),'new_end_on','2025-06-30','signed_on','2024-05-01'));
  perform t.mk('civic.officials', jsonb_build_object('contract_id',ctr,'individual_id',person,'role_id',t.val('civ.official.role.signatory'),'office_id',gov_off,'acted_on','2023-03-10'));
  -- political money: Acme gave to a party before the award
  party_e := t.mk('official.entities', jsonb_build_object('code','test.party-x','kind_id',t.val('ofc.entity.kind.political-party')));
  party := t.mk('politics.parties', jsonb_build_object('code','test.party-x','entity_id',party_e,'party_kind_id',t.val('pol.party.kind.registered')));
  perform t.mk('politics.contributions', jsonb_build_object('code','test.gift.1','donor_entity_id',acme,'recipient_party_id',party,'amount_minor_units',2000000,'currency_id',t.val('fin.currency.kes'),'is_in_kind',false,'given_on','2022-06-01','evidence_status_id',t.val('ref.evidence.status.sourced')));
  perform t.mk('source.coverage', jsonb_build_object('code','test.cov.1','country_id',ke,'source_id',src,'coverage_subject_id',t.val('src.coverage.subject.projects'),'level_id',t.val('src.coverage.level.none-published'),'checked_on','2026-11-19'));
  -- a promise with a recording (media), a transcript (content), no delivery found
  prom := t.mk('governance.promises', jsonb_build_object('code','test.promise.1','maker_holder_id',hold,'office_id',gov_off,'statement','Build a dispensary in every ward by 2025.','made_on','2022-09-10','place_feature_id',t.id('geography.features','ke.c1'),'status_id',t.val('gov.promise.status.no-record-found'),'status_as_of','2026-11-19'));
  perform t.mk('filesystem.media', jsonb_build_object('code','test.media.1','kind_id',t.val('fil.media.kind.video'),'title','Rally address','subject_table','governance.promises','subject_id',prom,'external_url','https://www.youtube.com/watch?v=test','platform_id',t.val('fil.media.platform.youtube'),'start_second',754,'end_second',812));
  lang := coalesce((select id from reference.languages limit 1), t.mk('reference.languages', jsonb_build_object('code','en','name','English','kind_id',t.val('ref.language.kind.living'))));
  cont := t.mk('filesystem.contents', jsonb_build_object('code','test.content.1','title','Transcript','body','Full transcript of the address...','category_id',t.val('fil.content.category.promise'),'language_id',lang,'is_development_text',false,'subject_table','governance.promises','subject_id',prom));
  -- later a project is matched to the promise by place and topic (proposed, unreviewed)
  proj := t.mk('civic.projects', jsonb_build_object('code','test.proj.1','name','Ward dispensary','description','x','status_id',t.val('civ.project.status.planned')));
  perform t.mk('governance.fulfilments', jsonb_build_object('promise_id',prom,'project_id',proj,'kind_id',t.val('gov.fulfilment.kind.matched-on-place-and-topic'),'evidence_status_id',t.val('ref.evidence.status.sourced'),'recorded_on','2026-11-19'));
  -- two sources disagree about the holder's start date; both kept
  disp := t.mk('source.disputes', jsonb_build_object('code','test.dispute.1','subject_table','governance.holders','subject_id',hold,'kind_id',t.val('src.dispute.kind.date'),'status_id',t.val('src.dispute.status.open'),'summary','Start of term differs between two sources.'));
  perform t.mk('source.contenders', jsonb_build_object('dispute_id',disp,'citation_id',cit,'claim','Took office 25 August 2022','position',1,'is_preferred',true));
  perform t.mk('source.contenders', jsonb_build_object('dispute_id',disp,'citation_id',cit2,'claim','Took office 30 August 2022','position',2,'is_preferred',false));
  -- right of reply by the company, text kept as filesystem content
  reply_c := t.mk('filesystem.contents', jsonb_build_object('code','test.content.2','title','Reply from Acme','body','Acme states the award followed the open procedure.','category_id',t.val('fil.content.category.reply'),'language_id',lang,'is_development_text',false,'subject_table','civic.contracts','subject_id',ctr));
  perform t.mk('community.replies', jsonb_build_object('subject_table','civic.contracts','subject_id',ctr,'respondent_entity_id',acme,'content_id',reply_c,'status_id',t.val('com.reply.status.published'),'received_at',now(),'published_at',now()));
  -- candidate domain from a pattern, no source yet
  tpl := t.mk('reference.templates', jsonb_build_object('code','county-site','pattern_id',(select id from reference.patterns limit 1),'produces','domain','name_template','{place.slug}.go.ke','code_template','ke.{place.slug}.site'));
  dom := t.mk('source.domains', jsonb_build_object('code','ke.c1.site','host','c1.go.ke','status_id',t.val('src.domain.status.candidate'),'entity_id',c1gov_e,'template_id',tpl));
  perform t.mk('reference.instances', jsonb_build_object('template_id',tpl,'unit_feature_id',t.id('geography.features','ke.c1'),'domain_id',dom,'status_id',t.val('ref.evidence.status.expected'),'generated_at',now()));
end $$;
