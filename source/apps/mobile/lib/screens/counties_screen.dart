import 'package:flutter/material.dart';

import '../data/preview_content.dart';
import '../theme/app_colors.dart';
import '../widgets/design_kit.dart';
import 'geography_explorer_screen.dart';

class CountiesScreen extends StatefulWidget {
  const CountiesScreen({super.key});

  @override
  State<CountiesScreen> createState() => _CountiesScreenState();
}

class _CountiesScreenState extends State<CountiesScreen> {
  final _search = TextEditingController();

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = _search.text.trim().toLowerCase();
    final counties = PreviewContent.counties
        .where((c) => c.name.toLowerCase().contains(query))
        .toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Counties'), centerTitle: false),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 28),
        children: [
          TextField(
            controller: _search,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: 'Search counties...',
              prefixIcon: const Icon(Icons.search),
            ),
          ),
          const SizedBox(height: 8),
          const Align(alignment: Alignment.centerLeft, child: PreviewBadge()),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: .86,
            children: [for (final c in counties) _card(context, c)],
          ),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (_) => const GeographyExplorerScreen(),
              ),
            ),
            icon: const Icon(Icons.arrow_forward, size: 16),
            label: const Text('View all 47 counties on the map'),
          ),
        ],
      ),
    );
  }

  Widget _card(BuildContext context, PreviewCounty county) => InkWell(
    onTap: () => Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => CountyProfileScreen(county: county),
      ),
    ),
    borderRadius: BorderRadius.circular(16),
    child: Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: context.colors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: context.colors.outlineVariant),
      ),
      child: Column(
        children: [
          Expanded(
            child: Image.asset(
              county.asset,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              children: [
                Text(
                  county.name,
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                Text(
                  county.descriptor,
                  style: TextStyle(
                    fontSize: 11.5,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

class CountyProfileScreen extends StatefulWidget {
  const CountyProfileScreen({super.key, required this.county});
  final PreviewCounty county;

  @override
  State<CountyProfileScreen> createState() => _CountyProfileScreenState();
}

class _CountyProfileScreenState extends State<CountyProfileScreen> {
  static const _tabs = ['Overview', 'Leadership', 'Budget', 'Projects'];
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final county = widget.county;
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          Stack(
            children: [
              Image.asset(
                county.asset,
                height: 210,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(8),
                  child: CircleAvatar(
                    backgroundColor: Colors.black45,
                    child: BackButton(
                      color: Colors.white,
                      onPressed: Navigator.of(context).pop,
                    ),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${county.name} County',
                  style: const TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  county.descriptor,
                  style: TextStyle(color: context.colors.onSurfaceVariant),
                ),
                const SizedBox(height: 12),
                UnderlineTabs(
                  labels: _tabs,
                  selected: _tab,
                  onSelected: (i) => setState(() => _tab = i),
                ),
                const SizedBox(height: 16),
                if (_tab == 0) ..._overview(context) else _pending(context),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _overview(BuildContext context) => [
    Text(
      'About ${widget.county.name}',
      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
    ),
    const SizedBox(height: 6),
    Text(
      'Sourced county facts, boundaries and records appear here as they are published in Mzizi.',
      style: TextStyle(height: 1.4, color: context.colors.onSurfaceVariant),
    ),
    const SizedBox(height: 16),
    Row(
      children: [
        for (final label in const ['Wards', 'Sub-counties', 'Population'])
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: context.colors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: context.colors.outlineVariant),
              ),
              child: Column(
                children: [
                  const Text(
                    '—',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 11,
                      color: context.colors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    ),
    const SizedBox(height: 8),
    const PreviewBadge(),
    const SizedBox(height: 16),
    BrandButton(
      label: 'Explore County',
      icon: Icons.arrow_forward,
      onPressed: () => Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => const GeographyExplorerScreen(),
        ),
      ),
    ),
  ];

  Widget _pending(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: Column(
      children: [
        Icon(Icons.hourglass_empty, color: AppColors.brand),
        const SizedBox(height: 8),
        Text(
          '${_tabs[_tab]} records are not available yet.',
          textAlign: TextAlign.center,
        ),
      ],
    ),
  );
}
