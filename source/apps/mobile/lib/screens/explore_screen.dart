import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../data/sample_data_store.dart';
import '../widgets/county_choropleth_map.dart';
import 'counties_screen.dart';
import 'geography_explorer_screen.dart';
import 'institutions_screen.dart';
import 'sample_data_screen.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key, this.onNavigate});

  final ValueChanged<int>? onNavigate;

  void _push(BuildContext context, Widget screen) =>
      Navigator.of(context)
          .push(MaterialPageRoute<void>(builder: (_) => screen));

  void _soon(BuildContext context, String name) => ScaffoldMessenger.of(context)
      .showSnackBar(
        SnackBar(
          content: Text('$name will appear when its data is available.'),
        ),
      );

  @override
  Widget build(BuildContext context) {
    final openMap = GeographyExplorerScreen(onNavigate: onNavigate);
    final categories = <(IconData, String, String, VoidCallback)>[
      (
        Icons.analytics_outlined,
        'Data visualization demo',
        'Ten sample datasets · charts and profiles',
        () => _push(context, const SampleDataScreen()),
      ),
      (
        Icons.account_tree_outlined,
        'Government structure preview',
        'Institutions, offices and office holders',
        () => _push(context, const SampleDataScreen(initialTopic: SampleTopic.governance)),
      ),
      (
        Icons.how_to_vote_outlined,
        'Political parties preview',
        'Branches, membership and positions',
        () => _push(context, const SampleDataScreen(initialTopic: SampleTopic.political)),
      ),
      (
        Icons.gavel_outlined,
        'Law and legislation preview',
        'Legal instruments and amendments',
        () => _push(context, const SampleDataScreen(initialTopic: SampleTopic.legal)),
      ),
      (
        Icons.receipt_long_outlined,
        'Procurement preview',
        'Tenders, bids, contracts and milestones',
        () => _push(context, const SampleDataScreen(initialTopic: SampleTopic.procurement)),
      ),
      (
        Icons.local_hospital_outlined,
        'Public services preview',
        'Facilities and service delivery',
        () => _push(context, const SampleDataScreen(initialTopic: SampleTopic.services)),
      ),
      (
        Icons.place_outlined,
        'Counties and geography',
        '47 counties and more',
        () => _push(context, const CountiesScreen()),
      ),
      (
        Icons.account_balance_outlined,
        'Government',
        'Structures and leadership',
        () => _push(context, const InstitutionsScreen()),
      ),
      (
        Icons.domain_outlined,
        'Public institutions',
        'Ministries, agencies',
        () => _push(context, const InstitutionsScreen()),
      ),
      (
        Icons.person_outline,
        'Public officials',
        'Leaders and representatives',
        () => _push(context, const SampleDataScreen(initialTopic: SampleTopic.people)),
      ),
      (
        Icons.menu_book_outlined,
        'Kenya’s history',
        'Our journey',
        () => onNavigate?.call(3),
      ),
      (
        Icons.gavel_outlined,
        'Constitution and law',
        'Rights and governance',
        () => _push(context, const SampleDataScreen(initialTopic: SampleTopic.legal)),
      ),
    ];
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        bottom: false,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 28),
          children: [
            Text(
              'Explore Kenya',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: context.colors.onSurface,
              ),
            ),
            const SizedBox(height: 14),
            InkWell(
              onTap: () => _push(context, openMap),
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 13,
                ),
                decoration: BoxDecoration(
                  color: context.colors.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: context.colors.outlineVariant),
                ),
                child: Row(
                  children: [
                    Icon(Icons.search, color: context.colors.onSurfaceVariant),
                    const SizedBox(width: 10),
                    Text(
                      'Search counties, institutions...',
                      style: TextStyle(color: context.colors.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),
            Container(
              height: 230,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                color: context.colors.surfaceContainerHigh,
                borderRadius: BorderRadius.circular(20),
              ),
              child: CountyChoroplethMap(
                onPlaceSelected: (_) => _push(context, openMap),
              ),
            ),
            const SizedBox(height: 18),
            Card(
              child: ListTile(
                leading: const Icon(Icons.science_outlined),
                title: const Text('Explore sample data'),
                subtitle: const Text('Offline demo · fictional examples, not real records'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => _push(context, const SampleDataScreen()),
              ),
            ),
            const SizedBox(height: 18),
            const Text(
              'Browse by category',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            for (final (icon, title, subtitle, onTap) in categories)
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: context.colors.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: context.colors.outlineVariant),
                ),
                child: ListTile(
                  onTap: onTap,
                  leading: Icon(icon, color: AppColors.brand),
                  title: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  subtitle: Text(
                    subtitle,
                    style: const TextStyle(fontSize: 12),
                  ),
                  trailing: const Icon(Icons.chevron_right),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
