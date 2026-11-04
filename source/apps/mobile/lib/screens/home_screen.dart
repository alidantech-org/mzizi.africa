import 'package:flutter/material.dart';

import '../data/domain_api.dart';
import '../data/geography_api.dart' show JsonObject;
import '../data/saved_library.dart';
import '../theme/app_colors.dart';
import '../widgets/county_choropleth_map.dart';
import '../widgets/sample_overview_panel.dart';
import 'sample_data_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, this.onNavigate});

  final ValueChanged<int>? onNavigate;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<JsonObject> _events = [];
  List<JsonObject> _budgets = [];
  String? _eventError;
  String? _financeError;
  bool _loadingEvents = true;
  bool _loadingFinance = true;
  int _eventTotal = 0;
  int _request = 0;

  @override
  void initState() {
    super.initState();
    _loadOverview();
  }

  Future<void> _loadOverview() async {
    final request = ++_request;
    setState(() {
      _loadingEvents = true;
      _loadingFinance = true;
      _eventError = null;
      _financeError = null;
    });
    await Future.wait([_loadEvents(request), _loadBudgets(request)]);
  }

  Future<void> _loadEvents(int request) async {
    if (mounted && request == _request) setState(() => _eventError = null);
    try {
      final result = await DomainApiClient.instance.events(limit: 4);
      if (!mounted || request != _request) return;
      setState(() {
        _events = result.items;
        _eventTotal = result.total;
        _loadingEvents = false;
      });
    } catch (error) {
      if (!mounted || request != _request) return;
      setState(() {
        _eventError = error.toString();
        _loadingEvents = false;
      });
    }
  }

  Future<void> _loadBudgets(int request) async {
    if (mounted && request == _request) setState(() => _financeError = null);
    try {
      final years = await DomainApiClient.instance.fiscalYears();
      JsonObject? current;
      for (final year in years.items) {
        if (year['isCurrent'] == true) {
          current = year;
          break;
        }
      }
      if (current == null) {
        if (mounted && request == _request) {
          setState(() {
            _budgets = [];
            _loadingFinance = false;
          });
        }
        return;
      }
      final result = await DomainApiClient.instance.budgets(
        fiscalYearId: current['id']?.toString(),
        limit: 3,
      );
      if (!mounted || request != _request) return;
      setState(() {
        _budgets = result.items;
        _loadingFinance = false;
      });
    } catch (error) {
      if (!mounted || request != _request) return;
      setState(() {
        _financeError = error.toString();
        _loadingFinance = false;
      });
    }
  }

  String _cleanError(String? error) => (error ?? '')
      .replaceFirst('Exception: ', '')
      .replaceFirst('Bad state: ', '');

  void _saveEvent(JsonObject event) {
    final id = event['id']?.toString();
    if (id == null || id.isEmpty) return;
    SavedLibrary.instance.toggle(
      SavedEntry(
        id: 'event:$id',
        title: event['title']?.toString() ?? 'Event record',
        type: 'Event record',
        description:
            event['description']?.toString() ?? 'No description provided.',
        reference: 'Mzizi event ${event['code'] ?? id}',
      ),
    );
    setState(() {});
  }

  void _saveBudget(JsonObject budget) {
    final id = budget['id']?.toString();
    if (id == null || id.isEmpty) return;
    SavedLibrary.instance.toggle(
      SavedEntry(
        id: 'budget:$id',
        title: '${budget['kind'] ?? 'Budget'} record',
        type: 'Budget record',
        description:
            '${budget['currencyCode'] ?? ''} ${budget['approvedAmount'] ?? ''}'
                .trim(),
        reference: 'Mzizi budget record $id',
      ),
    );
    setState(() {});
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    body: SafeArea(
      bottom: false,
      child: RefreshIndicator(
        onRefresh: _loadOverview,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 28),
          children: [
            _header(),
            const SizedBox(height: 22),
            Text(
              'KENYA · ${_dateLine()}',
              style: TextStyle(
                fontSize: 11,
                letterSpacing: 1,
                fontWeight: FontWeight.w800,
                color: context.colors.primary,
              ),
            ),
            const SizedBox(height: 5),
            Text(
              'Understand Kenya.',
              style: TextStyle(
                fontFamily: 'serif',
                fontSize: 31,
                height: 1.1,
                fontWeight: FontWeight.w800,
                color: context.colors.primary,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Explore how your country works, where public resources go and what’s happening around you.',
              style: TextStyle(
                fontSize: 14,
                height: 1.4,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 14),
            _hero(),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                leading: const Icon(Icons.analytics_outlined),
                title: const Text('Explore data visualizations'),
                subtitle: const Text('Offline sample data · fictional values, clearly labeled'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(builder: (_) => const SampleDataScreen()),
                ),
              ),
            ),
            const SizedBox(height: 12),
            const SampleOverviewPanel(),
            const SizedBox(height: 16),
            _searchEntry(),
            const SizedBox(height: 17),
            _mapPreview(),
            const SizedBox(height: 22),
            _sectionTitle('Explore your Kenya', 'Browse'),
            const SizedBox(height: 10),
            _quickLinks(),
            const SizedBox(height: 24),
            _sectionTitle('Events in Mzizi', 'History'),
            const SizedBox(height: 4),
            Text(
              'Public event records returned by the API.',
              style: TextStyle(color: context.colors.onSurfaceVariant),
            ),
            const SizedBox(height: 9),
            _eventPreview(),
            const SizedBox(height: 22),
            _sectionTitle('Public finance', 'Money'),
            const SizedBox(height: 4),
            Text(
              'Budget records for the current fiscal period when available.',
              style: TextStyle(color: context.colors.onSurfaceVariant),
            ),
            const SizedBox(height: 9),
            _financePreview(),
            const SizedBox(height: 20),
            _savedShortcut(),
          ],
        ),
      ),
    ),
  );

  Widget _header() => Row(
    children: [
      Text(
        'Mzizi.',
        style: TextStyle(
          fontFamily: 'serif',
          fontSize: 29,
          fontWeight: FontWeight.w900,
          color: context.colors.primary,
          letterSpacing: -.8,
        ),
      ),
      const Spacer(),
      IconButton(
        tooltip: 'Search places',
        onPressed: () => widget.onNavigate?.call(1),
        icon: const Icon(Icons.search),
      ),
      IconButton(
        tooltip: 'Event updates',
        onPressed: () => widget.onNavigate?.call(3),
        icon: const Icon(Icons.notifications_none),
      ),
    ],
  );

  Widget _searchEntry() => InkWell(
    onTap: () => widget.onNavigate?.call(1),
    borderRadius: BorderRadius.circular(18),
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
      decoration: BoxDecoration(
        color: context.colors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: context.colors.outlineVariant),
      ),
      child: Row(
        children: [
          Icon(Icons.search, color: context.colors.primary),
          const SizedBox(width: 9),
          Expanded(
            child: Text(
              'Search places and geography',
              style: TextStyle(color: context.colors.onSurfaceVariant),
            ),
          ),
          Icon(Icons.arrow_forward, size: 18, color: context.colors.primary),
        ],
      ),
    ),
  );

  Widget _mapPreview() => Container(
    clipBehavior: Clip.antiAlias,
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerHigh,
      borderRadius: BorderRadius.circular(22),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 205,
          child: CountyChoroplethMap(
            onPlaceSelected: (_) => widget.onNavigate?.call(1),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(15, 11, 11, 11),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Explore Kenya',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: context.colors.onSurface,
                      ),
                    ),
                    Text(
                      'Tap a verified county to explore its records',
                      style: TextStyle(
                        fontSize: 12,
                        color: context.colors.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton.filledTonal(
                tooltip: 'Open map',
                onPressed: () => widget.onNavigate?.call(1),
                icon: const Icon(Icons.arrow_forward),
              ),
            ],
          ),
        ),
      ],
    ),
  );

  Widget _sectionTitle(String title, String action) => Row(
    children: [
      Expanded(
        child: Text(
          title,
          style: TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.w800,
            color: context.colors.onSurface,
          ),
        ),
      ),
      TextButton(
        onPressed: () => widget.onNavigate?.call(
          action == 'History'
              ? 3
              : action == 'Money'
              ? 2
              : 1,
        ),
        child: Text(action),
      ),
    ],
  );

  Widget _quickLinks() => GridView.count(
    crossAxisCount: 2,
    crossAxisSpacing: 9,
    mainAxisSpacing: 9,
    shrinkWrap: true,
    physics: const NeverScrollableScrollPhysics(),
    childAspectRatio: 1.45,
    children: [
      _quickLink(
        Icons.account_balance_outlined,
        'Government',
        'National & county',
        1,
      ),
      _quickLink(Icons.place_outlined, 'Geography', 'Counties & places', 1),
      _quickLink(
        Icons.account_balance_wallet_outlined,
        'Public Money',
        'Budgets & projects',
        2,
      ),
      _quickLink(Icons.menu_book_outlined, 'History', 'Kenya’s past', 3),
    ],
  );

  String _dateLine() {
    const days = [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ];
    const months = [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ];
    final now = DateTime.now();
    return '${days[now.weekday - 1]}, ${now.day} ${months[now.month - 1]}';
  }

  Widget _hero() => Semantics(
    image: true,
    label: 'Mount Kenya',
    child: ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Image.asset(
        'assets/onboarding/mount_kenya.jpg',
        height: 150,
        width: double.infinity,
        fit: BoxFit.cover,
      ),
    ),
  );

  Widget _quickLink(IconData icon, String title, String subtitle, int tab) =>
      InkWell(
        onTap: () => widget.onNavigate?.call(tab),
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(
            color: context.colors.surfaceContainerLow,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: context.colors.outlineVariant),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, size: 30, color: AppColors.brand),
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 11,
                      color: context.colors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );

  Widget _eventPreview() {
    if (_loadingEvents) return const LinearProgressIndicator();
    if (_eventError != null) {
      return _notice(
        'Events are temporarily unavailable',
        _cleanError(_eventError),
        onRetry: () {
          setState(() => _loadingEvents = true);
          _loadEvents(_request);
        },
      );
    }
    if (_events.isEmpty) {
      return _notice('No event records returned', 'Try History again later.');
    }
    return Column(
      children: [
        for (final event in _events) _eventCard(event),
        if (_eventTotal > _events.length)
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton(
              onPressed: () => widget.onNavigate?.call(3),
              child: Text('View all ${_eventTotal == 0 ? '' : 'events'}'),
            ),
          ),
      ],
    );
  }

  Widget _eventCard(JsonObject event) => Card(
    margin: const EdgeInsets.only(bottom: 7),
    child: ListTile(
      leading: Icon(Icons.event_note, color: context.colors.primary),
      title: Text(event['title']?.toString() ?? 'Event record'),
      subtitle: Text(
        [
          if (event['startsOn'] != null) event['startsOn'].toString(),
          if (event['status'] != null) event['status'].toString(),
        ].join(' · '),
      ),
      trailing: IconButton(
        tooltip: 'Save event',
        onPressed: () => _saveEvent(event),
        icon: Icon(
          SavedLibrary.instance.contains('event:${event['id']}')
              ? Icons.bookmark
              : Icons.bookmark_border,
        ),
      ),
      onTap: () => widget.onNavigate?.call(3),
    ),
  );

  Widget _financePreview() {
    if (_loadingFinance) return const LinearProgressIndicator();
    if (_financeError != null) {
      return _notice(
        'Finance records are temporarily unavailable',
        _cleanError(_financeError),
        onRetry: () {
          setState(() => _loadingFinance = true);
          _loadBudgets(_request);
        },
      );
    }
    if (_budgets.isEmpty) {
      return _notice(
        'No budget records returned',
        'The API did not return public budget records for the current fiscal period.',
      );
    }
    return Column(children: _budgets.map(_budgetCard).toList());
  }

  Widget _budgetCard(JsonObject budget) => Card(
    margin: const EdgeInsets.only(bottom: 7),
    child: ListTile(
      leading: Icon(
        Icons.account_balance_wallet_outlined,
        color: context.colors.primary,
      ),
      title: Text(
        '${budget['currencyCode'] ?? ''} ${budget['approvedAmount'] ?? ''}',
        style: const TextStyle(fontWeight: FontWeight.w800),
      ),
      subtitle: Text(
        [
          budget['kind']?.toString() ?? 'Budget record',
          if (budget['programCode'] != null) budget['programCode'].toString(),
        ].join(' · '),
      ),
      trailing: IconButton(
        tooltip: 'Save budget record',
        onPressed: () => _saveBudget(budget),
        icon: Icon(
          SavedLibrary.instance.contains('budget:${budget['id']}')
              ? Icons.bookmark
              : Icons.bookmark_border,
        ),
      ),
      onTap: () => widget.onNavigate?.call(2),
    ),
  );

  Widget _savedShortcut() => AnimatedBuilder(
    animation: SavedLibrary.instance,
    builder: (context, _) => Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: context.colors.primary,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Icon(Icons.bookmark_outline, color: context.colors.onPrimary),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              '${SavedLibrary.instance.entries.length} saved records in My Mzizi',
              style: TextStyle(
                color: context.colors.onPrimary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          IconButton(
            onPressed: () => widget.onNavigate?.call(4),
            color: context.colors.onPrimary,
            icon: const Icon(Icons.arrow_forward),
          ),
        ],
      ),
    ),
  );

  Widget _notice(
    String title,
    String body, {
    VoidCallback? onRetry,
  }) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(15),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      borderRadius: BorderRadius.circular(17),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
        const SizedBox(height: 4),
        Text(body, style: TextStyle(color: context.colors.onSurfaceVariant)),
        if (onRetry != null)
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(onPressed: onRetry, child: const Text('Retry')),
          ),
      ],
    ),
  );
}
