import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class MoneyScreen extends StatefulWidget {
  const MoneyScreen({super.key, this.onNavigate});
  final ValueChanged<int>? onNavigate;

  @override
  State<MoneyScreen> createState() => _MoneyScreenState();
}

class _MoneyScreenState extends State<MoneyScreen> {
  final search = TextEditingController();
  final searchFocus = FocusNode();
  String fiscalYear = 'FY 2024/25 (Current)';

  List<({String keywords, Widget child})> get _sections => [
    (
      keywords: 'budget fiscal year appropriation county allocation',
      child: _fiscalCard(),
    ),
    (
      keywords:
          'money flow architecture parliament controller treasury county ward',
      child: _architecture(),
    ),
    (
      keywords: 'portals tenders procurement contractors suppliers contracts',
      child: _portals(),
    ),
    (
      keywords: 'evidence audit documents sources accountability',
      child: _evidenceDeepDive(),
    ),
    (
      keywords: 'ward inspections projects delivery citizen observation',
      child: _wardInspections(),
    ),
    (keywords: 'gazette records notices legislation', child: _gazetteRecords()),
  ];

  @override
  void dispose() {
    search.dispose();
    searchFocus.dispose();
    super.dispose();
  }

  void openSheet(String title, String body, {List<String> options = const []}) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (sheetContext) => SafeArea(
        child: Padding(
          padding: EdgeInsets.fromLTRB(20, 18, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: context.colors.outlineVariant,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
              SizedBox(height: 18),
              Text(
                title,
                style: TextStyle(
                  fontSize: 22.5,
                  fontWeight: FontWeight.w800,
                  color: context.colors.onSurface,
                ),
              ),
              SizedBox(height: 8),
              Text(
                body,
                style: TextStyle(
                  fontSize: 17,
                  height: 1.4,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
              ...options.map(
                (option) => ListTile(
                  dense: true,
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(
                    Icons.account_balance_outlined,
                    color: context.colors.primary,
                  ),
                  title: Text(option),
                  onTap: () {
                    if (title == 'Fiscal scope')
                      setState(() => fiscalYear = option);
                    Navigator.pop(sheetContext);
                  },
                ),
              ),
              SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(sheetContext),
                  child: Text('Close'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    body: SafeArea(
      bottom: false,
      child: Column(
        children: [
          _header(),
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: EdgeInsets.fromLTRB(16, 14, 16, 22),
                  sliver: SliverList.list(
                    children: [
                      _intro(),
                      SizedBox(height: 14),
                      _searchBar(),
                      SizedBox(height: 12),
                      ..._visibleSections(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );

  List<Widget> _visibleSections() {
    final query = search.text.trim().toLowerCase();
    final sections = _sections.where((section) {
      if (query.isEmpty) return true;
      final terms = query.split(RegExp(r'\s+'));
      return terms.any((term) => section.keywords.contains(term));
    }).toList();
    if (sections.isEmpty) {
      return [
        Padding(
          padding: EdgeInsets.symmetric(vertical: 28),
          child: Center(
            child: Text(
              'No public money sections match “${search.text.trim()}”. Try budget, tender, audit, ward, or gazette.',
              textAlign: TextAlign.center,
              style: TextStyle(color: context.colors.onSurfaceVariant),
            ),
          ),
        ),
      ];
    }
    final gaps = [14.0, 11.0, 11.0, 12.0, 12.0];
    return [
      for (var index = 0; index < sections.length; index++) ...[
        if (index > 0) SizedBox(height: gaps[index - 1]),
        sections[index].child,
      ],
    ];
  }

  Widget _header() => Container(
    padding: EdgeInsets.fromLTRB(10, 7, 10, 7),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      border: Border(bottom: BorderSide(color: context.colors.outlineVariant)),
    ),
    child: Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: context.colors.secondaryContainer,
            borderRadius: BorderRadius.circular(6),
          ),
          child: Icon(
            Icons.account_balance_outlined,
            size: 15,
            color: context.colors.primary,
          ),
        ),
        SizedBox(width: 6),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontFamily: 'serif',
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: context.colors.primary,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
        IconButton(
          onPressed: () => searchFocus.requestFocus(),
          visualDensity: VisualDensity.compact,
          icon: Icon(Icons.search, size: 18, color: context.colors.onSurface),
        ),
        CircleAvatar(
          radius: 12,
          backgroundColor: context.colors.outlineVariant,
          child: Icon(Icons.person, size: 15, color: context.colors.primary),
        ),
      ],
    ),
  );

  Widget _intro() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Row(
        children: [
          Icon(Icons.account_balance, size: 12, color: context.colors.primary),
          SizedBox(width: 4),
          Text(
            'CIVIC FISCAL OVERSIGHT',
            style: TextStyle(
              fontSize: 11.5,
              letterSpacing: .45,
              color: context.colors.primary,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
      SizedBox(height: 4),
      Text(
        'Public Money & Accountability',
        style: TextStyle(
          fontFamily: 'serif',
          fontSize: 21.5,
          height: 1.1,
          color: context.colors.onSurface,
          fontWeight: FontWeight.w800,
        ),
      ),
      SizedBox(height: 3),
      Text(
        'Follow the journey of public funds in Kenya — from parliamentary approval to local ward delivery.',
        style: TextStyle(
          fontSize: 14,
          color: context.colors.onSurfaceVariant,
          height: 1.3,
        ),
      ),
    ],
  );

  Widget _searchBar() => Container(
    height: 32,
    padding: EdgeInsets.symmetric(horizontal: 9),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: Row(
      children: [
        Icon(Icons.search, size: 14, color: context.colors.primary),
        SizedBox(width: 5),
        Expanded(
          child: TextField(
            controller: search,
            focusNode: searchFocus,
            textInputAction: TextInputAction.search,
            onChanged: (_) => setState(() {}),
            style: TextStyle(fontSize: 11.5),
            decoration: InputDecoration(
              border: InputBorder.none,
              isDense: true,
              hintText: 'Search tenders, contractors, budgets by key…',
              hintStyle: TextStyle(
                fontSize: 11.5,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            onSubmitted: (_) => setState(() {}),
          ),
        ),
        if (search.text.isNotEmpty)
          IconButton(
            visualDensity: VisualDensity.compact,
            padding: EdgeInsets.zero,
            constraints: BoxConstraints.tightFor(width: 22, height: 22),
            onPressed: () {
              search.clear();
              setState(() {});
            },
            icon: Icon(
              Icons.close,
              size: 14,
              color: context.colors.onSurfaceVariant,
            ),
          ),
      ],
    ),
  );

  Widget _fiscalCard() => Container(
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.calendar_today_outlined,
              size: 10,
              color: context.colors.onSurfaceVariant,
            ),
            SizedBox(width: 5),
            Text(
              'FISCAL SCOPE',
              style: TextStyle(
                fontSize: 10.5,
                color: context.colors.onSurfaceVariant,
                letterSpacing: .3,
              ),
            ),
            Spacer(),
            InkWell(
              onTap: () => openSheet(
                'Fiscal scope',
                'Choose the reporting year for public finance records.',
                options: ['FY 2024/25 (Current)', 'FY 2023/24', 'FY 2022/23'],
              ),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                decoration: BoxDecoration(
                  color: context.colors.primary,
                  borderRadius: BorderRadius.circular(13),
                ),
                child: Row(
                  children: [
                    Text(
                      fiscalYear,
                      style: TextStyle(
                        fontSize: 11,
                        color: context.colors.onPrimary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Icon(
                      Icons.keyboard_arrow_down,
                      size: 12,
                      color: context.colors.onPrimary,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'NATIONAL BUDGET ENVELOPE',
                    style: TextStyle(
                      fontSize: 10.5,
                      color: context.colors.onSurfaceVariant,
                      letterSpacing: .25,
                    ),
                  ),
                  Text(
                    'KES 3.99 Trillion',
                    style: TextStyle(
                      fontSize: 16,
                      color: context.colors.onSurface,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
            _pill(
              '◉ Enacted • CRA',
              context.colors.secondaryContainer,
              context.colors.primary,
            ),
          ],
        ),
      ],
    ),
  );

  Widget _architecture() => Container(
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      borderRadius: BorderRadius.circular(11),
      border: Border.all(color: context.colors.secondaryContainer),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'INTERACTIVE ARCHITECTURE',
                    style: TextStyle(
                      fontSize: 10.5,
                      letterSpacing: .3,
                      color: context.colors.primary,
                    ),
                  ),
                  Text(
                    'The Public Money Cycle in Kenya',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: context.colors.onSurface,
                    ),
                  ),
                ],
              ),
            ),
            InkWell(
              onTap: () => openSheet(
                'Public money cycle',
                'Explore the constitutional flow of public funds through allocation, procurement, execution, and audit.',
              ),
              child: Icon(
                Icons.swap_horiz,
                size: 15,
                color: context.colors.onSurfaceVariant,
              ),
            ),
          ],
        ),
        SizedBox(height: 4),
        Text(
          'Tap each milestone to trace institutional accountability gates established by the Constitution.',
          style: TextStyle(
            fontSize: 11,
            color: context.colors.onSurfaceVariant,
            height: 1.25,
          ),
        ),
        SizedBox(height: 6),
        _cycleStep(
          1,
          'Budget & Allocation',
          'National Treasury · Parliament · CRA',
          'Division of Revenue Bill splits funds between National Government and 47 Counties. Parliament scrutinizes through the Budget & Appropriations Committee.',
          'Phase 1',
        ),
        _cycleStep(
          2,
          'Procurement & Tendering',
          'PPIP Portal · AGPO Enactments',
          'Ministries and counties float public bids. Registered suppliers compete under the Public Procurement and Asset Disposal Act.',
          'Phase 2',
        ),
        _cycleStep(
          3,
          'Execution & Payment',
          'Controller of Budget (COB) · IFMIS',
          'Funds are released via COB when requisitions meet requirements. Milestones inspect prior to issuance of payment vouchers.',
          'Phase 3',
        ),
        _cycleStep(
          4,
          'Audit & Scrutiny',
          'Office of the Auditor-General (OAG)',
          'Post-expenditure forensic scrutiny reveals value-for-money, pending bills, and flagged unsupported queries before PAC/PIC committees.',
          'Phase 4',
          last: true,
        ),
      ],
    ),
  );

  Widget _cycleStep(
    int number,
    String title,
    String institution,
    String detail,
    String phase, {
    bool last = false,
  }) => InkWell(
    onTap: () => openSheet(title, '$institution. $detail'),
    child: Padding(
      padding: EdgeInsets.only(top: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 19,
            child: Column(
              children: [
                CircleAvatar(
                  radius: 8.5,
                  backgroundColor: number == 1
                      ? context.colors.primary
                      : context.colors.secondaryContainer,
                  child: Text(
                    '$number',
                    style: TextStyle(
                      fontSize: 11.5,
                      color: number == 1
                          ? context.colors.onPrimary
                          : context.colors.onSurface,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                if (!last)
                  Container(
                    width: 1,
                    height: 35,
                    color: context.colors.outline,
                  ),
              ],
            ),
          ),
          SizedBox(width: 4),
          Expanded(
            child: Container(
              margin: EdgeInsets.only(bottom: 3),
              padding: EdgeInsets.all(5),
              decoration: BoxDecoration(
                color: context.colors.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(7),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          '$number. $title',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: context.colors.onSurface,
                          ),
                        ),
                      ),
                      _pill(
                        phase,
                        context.colors.secondaryContainer,
                        context.colors.onSurfaceVariant,
                      ),
                    ],
                  ),
                  Text(
                    institution,
                    style: TextStyle(
                      fontSize: 10.5,
                      color: context.colors.primary,
                      height: 1.2,
                    ),
                  ),
                  Text(
                    detail,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 10.5,
                      height: 1.18,
                      color: context.colors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    ),
  );

  Widget _portals() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _sectionTitle('Public Portals & Repositories', '4 DIRECTORIES'),
      _portal(
        Icons.account_balance_wallet_outlined,
        'National & County Budgets',
        'Equitable Share allocations, Division of Revenue, and quarterly Controller of Budget expenditure reviews.',
        '47 Counties   •   National MDAs',
        context.colors.secondaryContainer,
      ),
      _portal(
        Icons.gavel_outlined,
        'Procurement & Contracts',
        'Search 12,400+ public tenders, awarded suppliers, contract valuations, and corporate beneficial owners.',
        '12,420 Active Bids   •   PPIP Live',
        context.colors.secondaryContainer,
      ),
      _portal(
        Icons.fact_check_outlined,
        'Public Projects Tracker',
        'Ward-level audits of health dispensaries, bypass roads, boreholes, and school facilities with geotagged citation.',
        '4,810 Geotagged   •   Photo Verified',
        context.colors.secondaryContainer,
      ),
      _portal(
        Icons.verified_user_outlined,
        'Auditor-General Reports',
        'Explore qualified audit opinions, unvouched expenditure, annual appropriation backlogs, and county pending bills.',
        'KES 16.2B Flagged   •   OAG Digest',
        context.colors.secondaryContainer,
      ),
    ],
  );

  Widget _portal(
    IconData icon,
    String title,
    String description,
    String metadata,
    Color iconBg,
  ) => InkWell(
    onTap: () => openSheet(
      title,
      description,
      options: [metadata, 'Open source directory'],
    ),
    child: Container(
      margin: EdgeInsets.only(bottom: 5),
      padding: EdgeInsets.all(7),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        borderRadius: BorderRadius.circular(9),
        border: Border.all(color: context.colors.outlineVariant),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 27,
            height: 27,
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(7),
            ),
            child: Icon(icon, size: 15, color: context.colors.primary),
          ),
          SizedBox(width: 7),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: context.colors.onSurface,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.chevron_right,
                      size: 12,
                      color: context.colors.onSurfaceVariant,
                    ),
                  ],
                ),
                Text(
                  description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 10.5,
                    height: 1.2,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
                SizedBox(height: 3),
                _pill(
                  metadata,
                  context.colors.outlineVariant,
                  context.colors.primary,
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );

  Widget _evidenceDeepDive() => Container(
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border.all(color: context.colors.outlineVariant),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'PUBLIC EVIDENCE DEEP DIVE',
                    style: TextStyle(
                      fontSize: 10.5,
                      color: context.colors.primary,
                      letterSpacing: .3,
                    ),
                  ),
                  Text(
                    'Where Does Kenya’s Tax Revenue Go?',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: context.colors.onSurface,
                    ),
                  ),
                ],
              ),
            ),
            InkWell(
              onTap: () => openSheet(
                'Revenue allocation',
                'Illustrative revenue distribution based on public budget categories.',
              ),
              child: CircleAvatar(
                radius: 10,
                backgroundColor: context.colors.secondaryContainer,
                child: Icon(
                  Icons.refresh,
                  size: 12,
                  color: context.colors.primary,
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 5),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: .72,
            minHeight: 8,
            backgroundColor: context.colors.secondaryContainer,
            color: context.colors.primary,
          ),
        ),
        SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: _revenueStat('Debt Servicing', '41%', 'KES 1.63 Trillion'),
            ),
            SizedBox(width: 5),
            Expanded(
              child: _revenueStat(
                'Recurrent Ops',
                '33%',
                'Salaries & Maintenance',
              ),
            ),
          ],
        ),
        SizedBox(height: 5),
        Row(
          children: [
            Expanded(
              child: _revenueStat(
                'Development',
                '15%',
                'Infrastructure & Capital',
              ),
            ),
            SizedBox(width: 5),
            Expanded(
              child: _revenueStat('County Transfers', '11%', 'Equitable Share'),
            ),
          ],
        ),
        SizedBox(height: 5),
        Row(
          children: [
            Icon(
              Icons.info_outline,
              size: 10,
              color: context.colors.onSurfaceVariant,
            ),
            SizedBox(width: 4),
            Expanded(
              child: Text(
                'Source: Controller of Budget BIR 2023/24',
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
            ),
            InkWell(
              onTap: () => openSheet(
                'Budget Implementation Report',
                'Illustrative source card for the Controller of Budget Budget Implementation Report.',
                options: ['Full Dataset'],
              ),
              child: Text(
                'Full Dataset ↗',
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ],
    ),
  );

  Widget _revenueStat(String title, String value, String detail) => Container(
    padding: EdgeInsets.all(6),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(7),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.circle, size: 5, color: context.colors.primary),
            SizedBox(width: 4),
            Text(
              title,
              style: TextStyle(fontSize: 10.5, color: context.colors.onSurface),
            ),
          ],
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: context.colors.primary,
          ),
        ),
        Text(
          detail,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 10.5,
            color: context.colors.onSurfaceVariant,
          ),
        ),
      ],
    ),
  );

  Widget _wardInspections() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _sectionTitle('Ward Ground Inspections', ''),
      Text(
        'Direct photographic testimony logged by citizen observers.',
        style: TextStyle(fontSize: 11, color: context.colors.onSurfaceVariant),
      ),
      SizedBox(height: 5),
      Row(
        children: [
          Expanded(
            child: _inspection(
              'Machakos Ward',
              'Kithimani Clinic',
              'KES 14.2M Complete',
              Icons.local_hospital_outlined,
              context.colors.secondaryContainer,
            ),
          ),
          SizedBox(width: 6),
          Expanded(
            child: _inspection(
              'Kilibi South',
              'Bofa Link Road',
              'Stalled at 60%',
              Icons.add_road,
              context.warningColor,
            ),
          ),
        ],
      ),
    ],
  );

  Widget _inspection(
    String ward,
    String title,
    String state,
    IconData icon,
    Color bg,
  ) => InkWell(
    onTap: () => openSheet(
      title,
      '$ward • $state. Citizen observation card; consult original project records.',
    ),
    child: Container(
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border.all(color: context.colors.outlineVariant),
        borderRadius: BorderRadius.circular(9),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 55,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Container(
                  color: bg,
                  child: Center(
                    child: Icon(
                      icon,
                      size: 32,
                      color: context.colors.primary.withValues(alpha: .72),
                    ),
                  ),
                ),
                Positioned(
                  left: 4,
                  top: 4,
                  child: _pill(
                    ward,
                    ward == 'Kilibi South'
                        ? context.colors.error
                        : context.colors.primary,
                    Theme.of(context).scaffoldBackgroundColor,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.all(5),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700),
                ),
                Row(
                  children: [
                    Icon(Icons.circle, size: 5, color: context.colors.primary),
                    SizedBox(width: 3),
                    Expanded(
                      child: Text(
                        state,
                        style: TextStyle(
                          fontSize: 10.5,
                          color: context.colors.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );

  Widget _gazetteRecords() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _sectionTitle('Recent Gazette Notices & Records', 'View All ›'),
      _notice(
        'Gazette Vol. CCXVI No. 89',
        'July 18, 2024',
        'County Allocation of Revenue Act (CARA) 2024 Schedule',
        'Official statutory disaggregation of the KES 400.1 Billion Equitable Share across all 47 County Governments.',
        'PDF (3.4 MB)',
        'Parliamentary Press',
        false,
      ),
      SizedBox(height: 5),
      _notice(
        'Special Audit Report',
        'June 29, 2024',
        'Special Audit on Pending Bills Across 47 Counties',
        'Forensic assessment flagging KES 78.4 Billion undocumented county obligations and unverified works.',
        'Summary & Annex (8.1 MB)',
        'Auditor General',
        true,
      ),
    ],
  );

  Widget _notice(
    String badge,
    String date,
    String title,
    String detail,
    String action,
    String source,
    bool red,
  ) => InkWell(
    onTap: () => openSheet(title, detail, options: [source, action]),
    child: Container(
      padding: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border.all(color: context.colors.outlineVariant),
        borderRadius: BorderRadius.circular(9),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _pill(
                badge,
                red ? context.colors.error : context.colors.outlineVariant,
                red ? context.colors.error : context.colors.onSurfaceVariant,
              ),
              Spacer(),
              Text(
                date,
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
          SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: context.colors.onSurface,
            ),
          ),
          SizedBox(height: 2),
          Text(
            detail,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 10.5,
              height: 1.2,
              color: context.colors.onSurfaceVariant,
            ),
          ),
          SizedBox(height: 5),
          Row(
            children: [
              Icon(
                Icons.download_outlined,
                size: 10,
                color: context.colors.primary,
              ),
              SizedBox(width: 3),
              Text(
                action,
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Spacer(),
              _pill(
                source,
                context.colors.outlineVariant,
                context.colors.onSurface,
              ),
            ],
          ),
        ],
      ),
    ),
  );

  Widget _sectionTitle(String title, String right) => Padding(
    padding: EdgeInsets.only(bottom: 5),
    child: Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: TextStyle(
              fontFamily: 'serif',
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: context.colors.onSurface,
            ),
          ),
        ),
        Text(
          right,
          style: TextStyle(
            fontSize: 10.5,
            color: context.colors.onSurfaceVariant,
          ),
        ),
      ],
    ),
  );
  Widget _pill(String text, Color bg, Color fg) => Container(
    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
    decoration: BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Text(
      text,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: TextStyle(fontSize: 10.5, color: fg, fontWeight: FontWeight.w600),
    ),
  );
}
