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

  @override
  void dispose() {
    search.dispose();
    searchFocus.dispose();
    super.dispose();
  }

  void openSheet(String title, String body, {List<String> options = const []}) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (sheetContext) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: line,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 22.5,
                  fontWeight: FontWeight.w800,
                  color: ink,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                body,
                style: const TextStyle(fontSize: 17, height: 1.4, color: muted),
              ),
              ...options.map(
                (option) => ListTile(
                  dense: true,
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(
                    Icons.account_balance_outlined,
                    color: forest,
                  ),
                  title: Text(option),
                  onTap: () {
                    if (title == 'Fiscal scope')
                      setState(() => fiscalYear = option);
                    Navigator.pop(sheetContext);
                  },
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(sheetContext),
                  child: const Text('Close'),
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
    backgroundColor: const Color(0xFFF4F9F3),
    body: SafeArea(
      bottom: false,
      child: Column(
        children: [
          _header(),
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(9, 8, 9, 15),
                  sliver: SliverList.list(
                    children: [
                      _intro(),
                      const SizedBox(height: 9),
                      _searchBar(),
                      const SizedBox(height: 8),
                      _fiscalCard(),
                      const SizedBox(height: 9),
                      _architecture(),
                      const SizedBox(height: 11),
                      _portals(),
                      const SizedBox(height: 11),
                      _evidenceDeepDive(),
                      const SizedBox(height: 12),
                      _wardInspections(),
                      const SizedBox(height: 12),
                      _gazetteRecords(),
                    ],
                  ),
                ),
              ],
            ),
          ),
          _bottomNav(),
        ],
      ),
    ),
  );

  Widget _header() => Container(
    padding: const EdgeInsets.fromLTRB(10, 7, 10, 7),
    decoration: const BoxDecoration(
      color: Color(0xFFF8FBF7),
      border: Border(bottom: BorderSide(color: line)),
    ),
    child: Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: const Color(0xFFE4ECE5),
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Icon(
            Icons.account_balance_outlined,
            size: 15,
            color: forest,
          ),
        ),
        const SizedBox(width: 6),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: deepGreen,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(fontSize: 10.5, color: muted),
              ),
            ],
          ),
        ),
        IconButton(
          onPressed: () => searchFocus.requestFocus(),
          visualDensity: VisualDensity.compact,
          icon: const Icon(Icons.search, size: 18, color: ink),
        ),
        const CircleAvatar(
          radius: 12,
          backgroundColor: Color(0xFFBCCFC1),
          child: Icon(Icons.person, size: 15, color: deepGreen),
        ),
      ],
    ),
  );

  Widget _intro() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Row(
        children: [
          Icon(Icons.account_balance, size: 12, color: forest),
          SizedBox(width: 4),
          Text(
            'CIVIC FISCAL OVERSIGHT',
            style: TextStyle(
              fontSize: 11.5,
              letterSpacing: .45,
              color: forest,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
      const SizedBox(height: 4),
      const Text(
        'Public Money & Accountability',
        style: TextStyle(
          fontSize: 21.5,
          height: 1.1,
          color: ink,
          fontWeight: FontWeight.w800,
        ),
      ),
      const SizedBox(height: 3),
      const Text(
        'Follow the journey of public funds in Kenya — from parliamentary approval to local ward delivery.',
        style: TextStyle(fontSize: 14, color: muted, height: 1.3),
      ),
    ],
  );

  Widget _searchBar() => Container(
    height: 32,
    padding: const EdgeInsets.symmetric(horizontal: 9),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: const Color(0xFFEAF0EA)),
    ),
    child: Row(
      children: [
        const Icon(Icons.search, size: 14, color: forest),
        const SizedBox(width: 5),
        Expanded(
          child: TextField(
            controller: search,
            focusNode: searchFocus,
            style: const TextStyle(fontSize: 11.5),
            decoration: const InputDecoration(
              border: InputBorder.none,
              isDense: true,
              hintText: 'Search tenders, contractors, budgets by key…',
              hintStyle: TextStyle(fontSize: 11.5, color: muted),
            ),
            onSubmitted: (value) => openSheet(
              'Fiscal search',
              'Illustrative results matching “$value”.',
            ),
          ),
        ),
        InkWell(
          onTap: () => openSheet(
            'Search filters',
            'Filter fiscal records by county, year, source institution, and evidence status.',
            options: [
              'County: Nakuru',
              'Source: Controller of Budget',
              'Status: Audited',
            ],
          ),
          child: const Icon(Icons.tune, size: 13, color: muted),
        ),
      ],
    ),
  );

  Widget _fiscalCard() => Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: const Color(0xFFEDF4EE),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.calendar_today_outlined, size: 10, color: muted),
            const SizedBox(width: 5),
            const Text(
              'FISCAL SCOPE',
              style: TextStyle(fontSize: 10.5, color: muted, letterSpacing: .3),
            ),
            const Spacer(),
            InkWell(
              onTap: () => openSheet(
                'Fiscal scope',
                'Choose the reporting year for public finance records.',
                options: ['FY 2024/25 (Current)', 'FY 2023/24', 'FY 2022/23'],
              ),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                decoration: BoxDecoration(
                  color: deepGreen,
                  borderRadius: BorderRadius.circular(13),
                ),
                child: Row(
                  children: [
                    Text(
                      fiscalYear,
                      style: const TextStyle(
                        fontSize: 11,
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const Icon(
                      Icons.keyboard_arrow_down,
                      size: 12,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'NATIONAL BUDGET ENVELOPE',
                    style: TextStyle(
                      fontSize: 10.5,
                      color: muted,
                      letterSpacing: .25,
                    ),
                  ),
                  const Text(
                    'KES 3.99 Trillion',
                    style: TextStyle(
                      fontSize: 16,
                      color: ink,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
            _pill('◉ Enacted • CRA', const Color(0xFFC5F1D9), forest),
          ],
        ),
      ],
    ),
  );

  Widget _architecture() => Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(11),
      border: Border.all(color: const Color(0xFFE9EFEA)),
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
                  const Text(
                    'INTERACTIVE ARCHITECTURE',
                    style: TextStyle(
                      fontSize: 10.5,
                      letterSpacing: .3,
                      color: forest,
                    ),
                  ),
                  const Text(
                    'The Public Money Cycle in Kenya',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: ink,
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
              child: const Icon(Icons.swap_horiz, size: 15, color: muted),
            ),
          ],
        ),
        const SizedBox(height: 4),
        const Text(
          'Tap each milestone to trace institutional accountability gates established by the Constitution.',
          style: TextStyle(fontSize: 11, color: muted, height: 1.25),
        ),
        const SizedBox(height: 6),
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
      padding: const EdgeInsets.only(top: 4),
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
                      ? deepGreen
                      : const Color(0xFFE3EAE4),
                  child: Text(
                    '$number',
                    style: TextStyle(
                      fontSize: 11.5,
                      color: number == 1 ? Colors.white : ink,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                if (!last)
                  Container(
                    width: 1,
                    height: 35,
                    color: const Color(0xFFC8D7CC),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 4),
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(bottom: 3),
              padding: const EdgeInsets.all(5),
              decoration: BoxDecoration(
                color: const Color(0xFFF0F5F0),
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
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: ink,
                          ),
                        ),
                      ),
                      _pill(phase, const Color(0xFFE3E9E4), muted),
                    ],
                  ),
                  Text(
                    institution,
                    style: const TextStyle(
                      fontSize: 10.5,
                      color: forest,
                      height: 1.2,
                    ),
                  ),
                  Text(
                    detail,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10.5,
                      height: 1.18,
                      color: muted,
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
        const Color(0xFFE1F1E6),
      ),
      _portal(
        Icons.gavel_outlined,
        'Procurement & Contracts',
        'Search 12,400+ public tenders, awarded suppliers, contract valuations, and corporate beneficial owners.',
        '12,420 Active Bids   •   PPIP Live',
        const Color(0xFFDDF4E8),
      ),
      _portal(
        Icons.fact_check_outlined,
        'Public Projects Tracker',
        'Ward-level audits of health dispensaries, bypass roads, boreholes, and school facilities with geotagged citation.',
        '4,810 Geotagged   •   Photo Verified',
        const Color(0xFFE7F1E8),
      ),
      _portal(
        Icons.verified_user_outlined,
        'Auditor-General Reports',
        'Explore qualified audit opinions, unvouched expenditure, annual appropriation backlogs, and county pending bills.',
        'KES 16.2B Flagged   •   OAG Digest',
        const Color(0xFFE6F0E6),
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
      margin: const EdgeInsets.only(bottom: 5),
      padding: const EdgeInsets.all(7),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(9),
        border: Border.all(color: const Color(0xFFE8EEE9)),
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
            child: Icon(icon, size: 15, color: forest),
          ),
          const SizedBox(width: 7),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: ink,
                        ),
                      ),
                    ),
                    const Icon(Icons.chevron_right, size: 12, color: muted),
                  ],
                ),
                Text(
                  description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 10.5,
                    height: 1.2,
                    color: muted,
                  ),
                ),
                const SizedBox(height: 3),
                _pill(metadata, const Color(0xFFEAF0EA), forest),
              ],
            ),
          ),
        ],
      ),
    ),
  );

  Widget _evidenceDeepDive() => Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: const Color(0xFFE6EEE7)),
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
                  const Text(
                    'PUBLIC EVIDENCE DEEP DIVE',
                    style: TextStyle(
                      fontSize: 10.5,
                      color: forest,
                      letterSpacing: .3,
                    ),
                  ),
                  const Text(
                    'Where Does Kenya’s Tax Revenue Go?',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: ink,
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
              child: const CircleAvatar(
                radius: 10,
                backgroundColor: Color(0xFFC5F1D9),
                child: Icon(Icons.refresh, size: 12, color: forest),
              ),
            ),
          ],
        ),
        const SizedBox(height: 5),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: const LinearProgressIndicator(
            value: .72,
            minHeight: 8,
            backgroundColor: Color(0xFFE5F2E8),
            color: Color(0xFF75E0AA),
          ),
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(
              child: _revenueStat('Debt Servicing', '41%', 'KES 1.63 Trillion'),
            ),
            const SizedBox(width: 5),
            Expanded(
              child: _revenueStat(
                'Recurrent Ops',
                '33%',
                'Salaries & Maintenance',
              ),
            ),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            Expanded(
              child: _revenueStat(
                'Development',
                '15%',
                'Infrastructure & Capital',
              ),
            ),
            const SizedBox(width: 5),
            Expanded(
              child: _revenueStat('County Transfers', '11%', 'Equitable Share'),
            ),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            const Icon(Icons.info_outline, size: 10, color: muted),
            const SizedBox(width: 4),
            const Expanded(
              child: Text(
                'Source: Controller of Budget BIR 2023/24',
                style: TextStyle(fontSize: 10.5, color: muted),
              ),
            ),
            InkWell(
              onTap: () => openSheet(
                'Budget Implementation Report',
                'Illustrative source card for the Controller of Budget Budget Implementation Report.',
                options: ['Full Dataset'],
              ),
              child: const Text(
                'Full Dataset ↗',
                style: TextStyle(
                  fontSize: 10.5,
                  color: forest,
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
    padding: const EdgeInsets.all(6),
    decoration: BoxDecoration(
      color: const Color(0xFFF0F5F0),
      borderRadius: BorderRadius.circular(7),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.circle, size: 5, color: forest),
            const SizedBox(width: 4),
            Text(title, style: const TextStyle(fontSize: 10.5, color: ink)),
          ],
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: forest,
          ),
        ),
        Text(
          detail,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(fontSize: 10.5, color: muted),
        ),
      ],
    ),
  );

  Widget _wardInspections() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _sectionTitle('Ward Ground Inspections', ''),
      const Text(
        'Direct photographic testimony logged by citizen observers.',
        style: TextStyle(fontSize: 11, color: muted),
      ),
      const SizedBox(height: 5),
      Row(
        children: [
          Expanded(
            child: _inspection(
              'Machakos Ward',
              'Kithimani Clinic',
              'KES 14.2M Complete',
              Icons.local_hospital_outlined,
              const Color(0xFFE8EEDF),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: _inspection(
              'Kilibi South',
              'Bofa Link Road',
              'Stalled at 60%',
              Icons.add_road,
              const Color(0xFFEDE7D8),
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
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE5ECE6)),
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
                      color: forest.withValues(alpha: .72),
                    ),
                  ),
                ),
                Positioned(
                  left: 4,
                  top: 4,
                  child: _pill(
                    ward,
                    ward == 'Kilibi South'
                        ? const Color(0xFFC94A45)
                        : deepGreen,
                    Colors.white,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(5),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Row(
                  children: [
                    const Icon(Icons.circle, size: 5, color: forest),
                    const SizedBox(width: 3),
                    Expanded(
                      child: Text(
                        state,
                        style: const TextStyle(fontSize: 10.5, color: muted),
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
      const SizedBox(height: 5),
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
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE7EEE8)),
        borderRadius: BorderRadius.circular(9),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _pill(
                badge,
                red ? const Color(0xFFFBE9E8) : const Color(0xFFEAF0EA),
                red ? const Color(0xFFC94A45) : muted,
              ),
              const Spacer(),
              Text(date, style: const TextStyle(fontSize: 10.5, color: muted)),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: ink,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            detail,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 10.5, height: 1.2, color: muted),
          ),
          const SizedBox(height: 5),
          Row(
            children: [
              const Icon(Icons.download_outlined, size: 10, color: forest),
              const SizedBox(width: 3),
              Text(
                action,
                style: const TextStyle(
                  fontSize: 10.5,
                  color: forest,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const Spacer(),
              _pill(source, const Color(0xFFEAF0EA), ink),
            ],
          ),
        ],
      ),
    ),
  );

  Widget _sectionTitle(String title, String right) => Padding(
    padding: const EdgeInsets.only(bottom: 5),
    child: Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: ink,
            ),
          ),
        ),
        Text(right, style: const TextStyle(fontSize: 10.5, color: muted)),
      ],
    ),
  );
  Widget _pill(String text, Color bg, Color fg) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
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

  Widget _bottomNav() => Container(
    decoration: const BoxDecoration(
      color: Color(0xFFFAFCFA),
      border: Border(top: BorderSide(color: line)),
    ),
    padding: EdgeInsets.only(
      top: 5,
      bottom: MediaQuery.of(context).padding.bottom > 0
          ? MediaQuery.of(context).padding.bottom
          : 7,
    ),
    child: Row(
      children: [
        _navItem(0, Icons.home_outlined, 'Home'),
        _navItem(1, Icons.explore_outlined, 'Explore'),
        _navItem(2, Icons.account_balance_wallet_outlined, 'Money'),
        _navItem(3, Icons.history, 'History'),
        _navItem(4, Icons.bookmark_border, 'Saved'),
      ],
    ),
  );
  Widget _navItem(int index, IconData icon, String label) => Expanded(
    child: InkWell(
      onTap: () {
        if (index <= 4) {
          widget.onNavigate?.call(index);
        } else {
          openSheet(label, '$label records and saved public evidence.');
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 17, color: index == 2 ? forest : muted),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10.5,
              color: index == 2 ? forest : muted,
              fontWeight: index == 2 ? FontWeight.w700 : FontWeight.w400,
            ),
          ),
        ],
      ),
    ),
  );
}
