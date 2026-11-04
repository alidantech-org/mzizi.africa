import 'package:flutter/material.dart';

import '../data/sample_data_store.dart';

/// Offline UI demonstration. Values are fictional and MUST NOT be presented as
/// live Mzizi facts, government data or verified research.
class SampleDataScreen extends StatefulWidget {
  const SampleDataScreen({super.key, this.initialTopic = SampleTopic.geography});

  final SampleTopic initialTopic;

  @override
  State<SampleDataScreen> createState() => _SampleDataScreenState();
}

class _SampleDataScreenState extends State<SampleDataScreen> {
  static const _store = SampleDataStore();
  late SampleTopic _topic;
  late Future<SampleDocument> _document;

  @override
  void initState() {
    super.initState();
    _topic = widget.initialTopic;
    _document = _store.load(_topic);
  }

  void _select(SampleTopic topic) {
    setState(() {
      _topic = topic;
      _document = _store.load(topic);
    });
  }

  static Map<String, dynamic> _object(Object? value) =>
      value is Map<String, dynamic> ? value : <String, dynamic>{};

  static List<dynamic> _items(Object? value) =>
      value is List ? value : const <dynamic>[];

  static String _text(Object? value, [String missing = 'Not recorded']) =>
      value == null || value.toString().isEmpty
          ? missing
          : value.toString();

  static String _number(Object? value) {
    if (value is! num) return 'Not available';
    final whole = value.toInt().toString();
    final buffer = StringBuffer();
    for (var i = 0; i < whole.length; i++) {
      if (i > 0 && (whole.length - i) % 3 == 0) buffer.write(',');
      buffer.write(whole[i]);
    }
    return buffer.toString();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Explore sample data')),
    body: SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 30),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.tertiaryContainer,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.science_outlined),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'DEMO ONLY · FICTIONAL DATA',
                        style: TextStyle(fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 5),
                Text(
                  'These records demonstrate how Mzizi can display maps, profiles, election results, statistics and finances. They are not real public records and do not come from the live API.',
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                for (final topic in SampleTopic.values)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(topic.label),
                      selected: _topic == topic,
                      onSelected: (_) => _select(topic),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          FutureBuilder<SampleDocument>(
            future: _document,
            builder: (context, snapshot) {
              if (snapshot.connectionState != ConnectionState.done) {
                return const Padding(
                  padding: EdgeInsets.all(36),
                  child: Center(child: CircularProgressIndicator()),
                );
              }
              if (snapshot.hasError || !snapshot.hasData) {
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      children: [
                        const Text('Could not load bundled sample data.'),
                        const SizedBox(height: 8),
                        Text(
                          snapshot.error?.toString() ?? 'File unavailable',
                          textAlign: TextAlign.center,
                        ),
                        TextButton(
                          onPressed: () => _select(_topic),
                          child: const Text('Try again'),
                        ),
                      ],
                    ),
                  ),
                );
              }
              final data = snapshot.data!.data;
              return switch (_topic) {
                SampleTopic.geography => _geography(data),
                SampleTopic.people => _person(data),
                SampleTopic.elections => _elections(data),
                SampleTopic.statistics => _statistics(data),
                SampleTopic.finance => _finance(data),
                SampleTopic.governance => _governance(data),
                SampleTopic.political => _political(data),
                SampleTopic.legal => _legal(data),
                SampleTopic.procurement => _procurement(data),
                SampleTopic.services => _services(data),
              };
            },
          ),
        ],
      ),
    ),
  );

  Widget _heading(String title, String subtitle) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 23, fontWeight: FontWeight.w800)),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
        ),
      ],
    ),
  );

  Widget _section(String title, List<Widget> children) => Card(
    margin: const EdgeInsets.only(bottom: 12),
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          ...children,
        ],
      ),
    ),
  );

  Widget _field(String label, Object? value) => Padding(
    padding: const EdgeInsets.only(bottom: 9),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
        ),
        Expanded(child: Text(_text(value), style: const TextStyle(fontWeight: FontWeight.w600))),
      ],
    ),
  );

  Widget _meter(String label, num value, num max, {String? suffix}) {
    final fraction = max <= 0 ? 0.0 : (value / max).clamp(0.0, 1.0).toDouble();
    return Padding(
      padding: const EdgeInsets.only(bottom: 13),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(label, maxLines: 2, overflow: TextOverflow.ellipsis)),
              Text(suffix ?? _number(value), style: const TextStyle(fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 5),
          LinearProgressIndicator(value: fraction, minHeight: 9, borderRadius: BorderRadius.circular(6)),
        ],
      ),
    );
  }

  Widget _geography(Map<String, dynamic> data) {
    final boundary = _object(data['boundary']);
    final parent = _object(data['parent']);
    final children = _items(data['children']);
    final validity = _object(data['validity']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(data['name']), 'Geographic hierarchy · fictional example'),
        _section('Region details', [
          _field('Code', data['code']),
          _field('Type', data['kind']),
          _field('Parent', parent['name']),
          _field('Valid from', validity['validFrom']),
        ]),
        _section('Subregions', [
          if (children.isEmpty) const Text('No subregions in this sample.'),
          for (final child in children)
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.place_outlined),
              title: Text(_text(_object(child)['name'])),
              subtitle: Text(_text(_object(child)['kind'])),
            ),
        ]),
        _section('Map boundary', [
          const Icon(Icons.map_outlined, size: 42),
          const SizedBox(height: 8),
          Text(
            boundary['geometry'] == null
                ? 'No verified geometry is included in this demonstration. A real boundary requires a dated, sourced GeoJSON response.'
                : 'Geometry available',
          ),
        ]),
      ],
    );
  }

  Widget _person(Map<String, dynamic> data) {
    final roles = _items(data['roles']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(data['displayName']), 'Fictional public profile'),
        _section('About', [
          _field('Life status', data['lifeStatus']),
          Text(_text(data['summary'])),
        ]),
        _section('Office history', [
          for (final entry in roles) ...[
            _field('Office', _object(_object(entry)['office'])['name']),
            _field('Institution', _object(_object(entry)['institution'])['name']),
            _field('From', _object(entry)['validFrom']),
            _field('To', _object(entry)['validTo']),
          ],
          if (roles.isEmpty) const Text('No offices recorded.'),
        ]),
        _section('Evidence and privacy', [
          const Text('Only public information may be displayed. No private contacts are bundled.'),
          _field('Verification', _object(data['evidence'])['verificationState']),
        ]),
      ],
    );
  }

  Widget _elections(Map<String, dynamic> data) {
    final election = _object(data['election']);
    final electorate = _object(data['electorate']);
    final candidates = _items(data['candidates']);
    final maximum = candidates.fold<num>(
      0,
      (m, item) {
        final v = _object(item)['votes'];
        return v is num && v > m ? v : m;
      },
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(election['name']), 'Fictional election · unverified results'),
        _section('Ballot summary', [
          _field('Held on', election['heldDate']),
          _field('Registered', _number(electorate['registeredVoters'])),
          _field('Votes cast', _number(electorate['votesCast'])),
          _field('Valid ballots', _number(electorate['validVotes'])),
          _field('Rejected', _number(electorate['rejectedVotes'])),
          _field('Turnout', data['derived'] is Map
              ? _text(_object(data['derived'])['turnoutPercent']) + '% · calculated'
              : 'Not available'),
        ]),
        _section('Candidate vote comparison', [
          const Text('Same fictional seat and declaration level · votes'),
          const SizedBox(height: 12),
          for (final candidate in candidates)
            _meter(
              _text(_object(_object(candidate)['person'])['name']),
              (_object(candidate)['votes'] as num?) ?? 0,
              maximum,
            ),
          Text(
            'Result status: ' + _text(_object(data['declaration'])['verificationState']),
          ),
        ]),
      ],
    );
  }

  Widget _statistics(Map<String, dynamic> data) {
    final indicator = _object(data['indicator']);
    final vintage = _object(data['vintage']);
    final points = _items(data['points']);
    final values = points
        .map((e) => _object(e)['value'])
        .whereType<num>()
        .toList();
    final max = values.isEmpty ? 0 : values.reduce((a, b) => a > b ? a : b);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(indicator['name']), 'Synthetic statistical time series'),
        _section('Series context', [
          _field('Unit', indicator['unitOfMeasure']),
          _field('Release', vintage['label']),
          _field('Estimate', data['estimateKind']),
          _field('Method', data['methodology']),
        ]),
        _section('Observations by period', [
          for (final point in points)
            if (_object(point)['value'] is num)
              _meter(
                _text(_object(point)['period']),
                _object(point)['value'] as num,
                max,
                suffix: _number(_object(point)['value']) +
                    ' ' + _text(indicator['unitOfMeasure'], ''),
              )
            else
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(_text(_object(point)['period'])),
                subtitle: const Text('No recorded value — not zero'),
                leading: const Icon(Icons.horizontal_rule),
              ),
        ]),
        _section('Quality', [
          _field('Verification', _object(data['evidence'])['verificationState']),
          const Text('Values, vintages and uncertainty must be checked before comparing real observations.'),
        ]),
      ],
    );
  }

  Widget _finance(Map<String, dynamic> data) {
    final year = _object(data['fiscalYear']);
    final totals = _object(data['totals']);
    final unit = _object(data['budgetaryUnit']);
    final items = _items(data['breakdown']);
    final currency = _text(data['currency'], '');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(unit['name']), 'Synthetic public finance'),
        _section('Fiscal summary', [
          _field('Fiscal period', _text(year['startsOn']) + ' – ' + _text(year['endsOn'])),
          _field('Currency', currency),
          _field('Revision', data['revision']),
          _field('Budget', currency + ' ' + _number(totals['budgeted'])),
          _field('Expenditure', currency + ' ' + _number(totals['expenditure'])),
          _field('Revenue', totals['revenue'] == null
              ? 'Not available'
              : currency + ' ' + _number(totals['revenue'])),
        ]),
        _section('Budget by program', [
          for (final item in items)
            _meter(
              _text(_object(item)['label']),
              (_object(item)['budgeted'] as num?) ?? 0,
              (totals['budgeted'] as num?) ?? 0,
              suffix: currency + ' ' + _number(_object(item)['budgeted']),
            ),
        ]),
        _section('Interpretation', [
          const Text('Amounts are fictional. Comparing real allocations and expenditures requires the same currency, period and reporting basis.'),
        ]),
      ],
    );
  }

  Widget _governance(Map<String, dynamic> data) {
    final institution = _object(data['institution']);
    final offices = _items(data['offices']);
    final holders = _items(data['holders']);
    final relationships = _items(data['relationships']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(institution['name']), 'Sample institution and office hierarchy'),
        _section('Institution', [
          _field('Code', institution['code']),
          _field('Description', institution['description']),
        ]),
        _section('Offices and holders', [
          for (final item in offices) ...[
            Builder(builder: (context) {
              final office = _object(item);
              final related = holders.where((h) => _object(h)['officeId'] == office['id']).toList();
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.account_balance_outlined),
                    title: Text(_text(office['name'])),
                    subtitle: Text(office['isSingleton'] == true ? 'Single office' : 'Multiple posts possible'),
                  ),
                  for (final holder in related) Padding(
                    padding: const EdgeInsets.only(left: 10, bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _field('Holder', _object(_object(holder)['person'])['displayName']),
                        _field('Status', _object(holder)['status']),
                        _field('Term begins', _object(holder)['validFrom']),
                        _field('Term ends', _object(holder)['validTo'] ?? 'Not recorded'),
                      ],
                    ),
                  ),
                ],
              );
            }),
          ],
        ]),
        _section('Institutional relationships', [
          for (final link in relationships)
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.account_tree_outlined),
              title: Text(_text(_object(link)['objectName'])),
              subtitle: Text('Relationship: ' + _text(_object(link)['kind'])),
            ),
        ]),
        _verification(data),
      ],
    );
  }

  Widget _political(Map<String, dynamic> data) {
    final party = _object(data['party']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(party['name']), 'Synthetic political organization'),
        _section('Party profile', [
          _field('Abbreviation', party['abbreviation']),
          _field('Status', party['status']),
          _field('Code', party['code']),
        ]),
        _section('Branches', [
          for (final item in _items(data['units']))
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.hub_outlined),
              title: Text(_text(_object(item)['name'])),
              subtitle: Text('Code: ' + _text(_object(item)['code'])),
            ),
        ]),
        _section('Membership and party offices', [
          for (final item in _items(data['memberships'])) ...[
            _field('Member', _object(item)['personName']),
            _field('Role', _object(item)['roleTitle']),
          ],
          for (final item in _items(data['positions'])) ...[
            _field('Position', _object(item)['title']),
            _field('Holder', _object(_object(item)['holder'])['displayName']),
          ],
        ]),
        _section('Classifications', [
          for (final item in _items(data['ideologies']))
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(_text(_object(item)['label'])),
              subtitle: Text(_text(_object(item)['description'])),
            ),
        ]),
        _verification(data),
      ],
    );
  }

  Widget _legal(Map<String, dynamic> data) {
    final instrument = _object(data['instrument']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(instrument['title']), 'Fictional legal instrument and provision history'),
        _section('Instrument', [
          _field('Code', instrument['code']),
          _field('Status', instrument['status']),
          Text(_text(instrument['summary'])),
        ]),
        _section('Provisions', [
          for (final item in _items(data['provisions'])) ...[
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.menu_book_outlined),
              title: Text(_text(_object(item)['citation']) + ': ' + _text(_object(item)['heading'])),
              subtitle: Text(_text(_object(item)['content'])),
            ),
            const Divider(height: 8),
          ],
        ]),
        _section('Amendments', [
          for (final item in _items(data['amendments'])) ...[
            _field('Reference', _object(item)['code']),
            _field('Summary', _object(item)['summary']),
            for (final change in _items(_object(item)['changes']))
              _field('Change', _object(change)['kind']),
          ],
        ]),
        _section('Links to public offices', [
          for (final item in _items(data['legalLinks']))
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.link_outlined),
              title: Text(_text(_object(item)['targetLabel'])),
              subtitle: Text(_text(_object(item)['note'])),
            ),
        ]),
        _verification(data),
      ],
    );
  }

  Widget _procurement(Map<String, dynamic> data) {
    final tender = _object(data['tender']);
    final contract = _object(data['contract']);
    final currency = _text(tender['currencyCode'], '');
    final bids = _items(data['bids']);
    final values = bids.map((b) => _object(b)['amount']).whereType<num>().toList();
    final max = values.isEmpty ? 0 : values.reduce((a, b) => a > b ? a : b);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(tender['title']), 'Synthetic tender, bids and contract'),
        _section('Tender', [
          _field('Reference', tender['code']),
          _field('Status', tender['status']),
          _field('Published', tender['publishedOn']),
          _field('Deadline', tender['closesOn']),
          _field('Estimated value', '$currency ${_number(tender['estimatedValue'])}'),
        ]),
        _section('Bid comparison', [
          for (final item in bids)
            _meter(
              _text(_object(item)['bidderName']) + ' · ' + _text(_object(item)['status']),
              (_object(item)['amount'] as num?) ?? 0,
              max,
              suffix: '$currency ${_number(_object(item)['amount'])}',
            ),
          const Text('Comparisons require the same currency and evaluation basis.'),
        ]),
        _section('Awarded contract', [
          _field('Contract', contract['code']),
          _field('Supplier', contract['awardedEntityName']),
          _field('Value', '$currency ${_number(contract['value'])}'),
          _field('Status', contract['status']),
        ]),
        _section('Milestones', [
          for (final item in _items(data['milestones']))
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Icon(_object(item)['completedOn'] == null
                  ? Icons.schedule_outlined : Icons.check_circle_outline),
              title: Text(_text(_object(item)['title'])),
              subtitle: Text('Due: ' + _text(_object(item)['dueOn'])
                  + ' · Completed: ' + _text(_object(item)['completedOn'])),
            ),
        ]),
        _section('Contract variations', [
          for (final item in _items(data['variations'])) ...[
            _field('Amount change', '$currency ${_number(_object(item)['amountChange'])}'),
            _field('Reason', _object(item)['reason']),
            _field('Approved', _object(item)['approvedOn']),
          ],
        ]),
        _verification(data),
      ],
    );
  }

  Widget _services(Map<String, dynamic> data) {
    final service = _object(data['service']);
    final deliveries = _items(data['deliveries']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _heading(_text(service['name']), 'Fictional public service and facility register'),
        _section('Service definition', [
          _field('Code', service['code']),
          Text(_text(service['description'])),
        ]),
        _section('Facilities and delivery status', [
          for (final item in _items(data['amenities']))
            Builder(builder: (context) {
              final amenity = _object(item);
              final linked = deliveries.where((d) =>
                _object(d)['amenityId'] == amenity['id']).toList();
              return ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.local_hospital_outlined),
                title: Text(_text(amenity['name'])),
                subtitle: Text(
                  'Facility: ' + (amenity['isActive'] == true ? 'active' : 'inactive') +
                  ' · Service: ' + (linked.isEmpty
                      ? 'not recorded'
                      : _text(_object(linked.first)['status'])),
                ),
              );
            }),
        ]),
        _section('Linked funding and responsibility', [
          for (final item in deliveries) ...[
            _field('Delivery status', _object(item)['status']),
            _field('Budget record', _object(item)['budgetId']),
            _field('Responsible office', _object(item)['responsibleOfficeId']),
          ],
          const Text('These are synthetic record links. Actual budgets and offices need API resolution.'),
        ]),
        _verification(data),
      ],
    );
  }

  Widget _verification(Map<String, dynamic> data) => _section(
    'Source and verification',
    [
      _field('Status', _object(data['evidence'])['verificationState']),
      const Text(
        'Fictional preview only. No official source or verified record is claimed.',
      ),
    ],
  );
}
