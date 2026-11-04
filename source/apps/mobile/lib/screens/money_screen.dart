import 'package:flutter/material.dart';

import '../data/domain_api.dart';
import '../data/geography_api.dart' show JsonObject;
import '../data/saved_library.dart';
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
  List<JsonObject> _fiscalYears = [];
  final List<JsonObject> _budgets = [];
  String? _selectedFiscalYearId;
  String? _error;
  bool _loading = true;
  bool _loadingMore = false;
  int _page = 1;
  int _totalPages = 0;
  int _request = 0;

  @override
  void initState() {
    super.initState();
    _loadFinance(reset: true);
  }

  @override
  void dispose() {
    search.dispose();
    searchFocus.dispose();
    super.dispose();
  }

  Future<void> _loadFinance({required bool reset, String? fiscalYearId}) async {
    final request = ++_request;
    setState(() {
      _error = null;
      if (reset) {
        _loading = true;
        _budgets.clear();
      } else {
        _loadingMore = true;
      }
    });
    try {
      final years = _fiscalYears.isEmpty
          ? await DomainApiClient.instance.fiscalYears()
          : null;
      final availableYears = years?.items ?? _fiscalYears;
      String? selectedId = fiscalYearId ?? _selectedFiscalYearId;
      if (selectedId == null) {
        for (final year in availableYears) {
          if (year['isCurrent'] == true) {
            selectedId = year['id']?.toString();
            break;
          }
        }
      }
      final result = selectedId == null
          ? (items: <JsonObject>[], page: 1, totalPages: 0, total: 0)
          : await DomainApiClient.instance.budgets(
              fiscalYearId: selectedId,
              page: reset ? 1 : _page + 1,
            );
      if (!mounted || request != _request) return;
      setState(() {
        _fiscalYears = availableYears;
        _selectedFiscalYearId = selectedId;
        _budgets.addAll(result.items);
        _page = result.page;
        _totalPages = result.totalPages;
        _loading = false;
        _loadingMore = false;
      });
    } catch (error) {
      if (!mounted || request != _request) return;
      setState(() {
        _error = error.toString();
        _loading = false;
        _loadingMore = false;
      });
    }
  }

  JsonObject? get _selectedYear {
    for (final year in _fiscalYears) {
      if (year['id']?.toString() == _selectedFiscalYearId) return year;
    }
    return null;
  }

  List<JsonObject> get _visibleBudgets {
    final query = search.text.trim().toLowerCase();
    if (query.isEmpty) return _budgets;
    return _budgets.where((budget) {
      return [
        budget['kind'],
        budget['programCode'],
        budget['unitId'],
        budget['currencyCode'],
      ].any(
        (value) => value?.toString().toLowerCase().contains(query) ?? false,
      );
    }).toList();
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
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 28),
              children: [
                Text(
                  'Public finance',
                  style: TextStyle(
                    fontFamily: 'serif',
                    fontSize: 25,
                    fontWeight: FontWeight.w800,
                    color: context.colors.primary,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'Budget records published in Mzizi. Amounts and currencies are shown as recorded; this screen does not calculate totals from partial results.',
                  style: TextStyle(
                    fontSize: 14,
                    height: 1.35,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 16),
                _fiscalSelector(),
                const SizedBox(height: 14),
                TextField(
                  controller: search,
                  focusNode: searchFocus,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Filter loaded budgets',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: search.text.isEmpty
                        ? null
                        : IconButton(
                            onPressed: () {
                              search.clear();
                              setState(() {});
                            },
                            icon: const Icon(Icons.close),
                          ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    isDense: true,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  'BUDGET RECORDS',
                  style: TextStyle(
                    fontSize: 11.5,
                    letterSpacing: .35,
                    color: context.colors.onSurfaceVariant,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                if (_loading)
                  const Padding(
                    padding: EdgeInsets.all(28),
                    child: Center(child: CircularProgressIndicator()),
                  )
                else if (_error != null)
                  _message(
                    icon: Icons.cloud_off_outlined,
                    title: 'Could not load Mzizi finance records',
                    body:
                        '${_error!.replaceFirst('Exception: ', '').replaceFirst('Bad state: ', '')} Check the API connection and try again.',
                    action: 'Retry',
                    onPressed: () => _loadFinance(reset: true),
                  )
                else if (_visibleBudgets.isEmpty)
                  _message(
                    icon: Icons.account_balance_wallet_outlined,
                    title: 'No budget records found',
                    body: search.text.isEmpty
                        ? 'No public budget records were returned for this fiscal period.'
                        : 'No loaded budget records match “${search.text.trim()}”.',
                  )
                else ...[
                  ..._visibleBudgets.map(_budgetCard),
                  if (_page < _totalPages)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: OutlinedButton.icon(
                        onPressed: _loadingMore
                            ? null
                            : () => _loadFinance(
                                reset: false,
                                fiscalYearId: _selectedFiscalYearId,
                              ),
                        icon: _loadingMore
                            ? const SizedBox.square(
                                dimension: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.expand_more),
                        label: Text(_loadingMore ? 'Loading…' : 'Load more'),
                      ),
                    ),
                ],
              ],
            ),
          ),
        ],
      ),
    ),
  );

  Widget _header() => Container(
    padding: const EdgeInsets.fromLTRB(12, 7, 12, 7),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      border: Border(bottom: BorderSide(color: context.colors.outlineVariant)),
    ),
    child: Row(
      children: [
        Icon(
          Icons.account_balance_outlined,
          size: 20,
          color: context.colors.primary,
        ),
        const SizedBox(width: 7),
        Expanded(
          child: Text(
            'Mzizi Africa',
            style: TextStyle(
              fontFamily: 'serif',
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: context.colors.primary,
            ),
          ),
        ),
        IconButton(
          onPressed: searchFocus.requestFocus,
          icon: const Icon(Icons.search, size: 19),
          visualDensity: VisualDensity.compact,
        ),
      ],
    ),
  );

  Widget _fiscalSelector() {
    final year = _selectedYear;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 3),
      decoration: BoxDecoration(
        color: context.colors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: context.colors.outlineVariant),
      ),
      child: Row(
        children: [
          Icon(Icons.calendar_month, color: context.colors.primary),
          const SizedBox(width: 9),
          Expanded(
            child: _fiscalYears.isEmpty
                ? const Text('Fiscal period')
                : DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      isExpanded: true,
                      value: _selectedFiscalYearId,
                      hint: const Text('Choose fiscal period'),
                      items: _fiscalYears.map((item) {
                        final id = item['id']?.toString();
                        final code = item['code']?.toString() ?? 'Fiscal year';
                        return DropdownMenuItem(
                          value: id,
                          child: Text(
                            '${item['isCurrent'] == true ? 'Current · ' : ''}$code',
                            overflow: TextOverflow.ellipsis,
                          ),
                        );
                      }).toList(),
                      onChanged: (id) {
                        if (id != null) {
                          setState(() => _selectedFiscalYearId = id);
                          _loadFinance(reset: true, fiscalYearId: id);
                        }
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  void _toggleSavedBudget(JsonObject budget) {
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

  Widget _budgetCard(JsonObject budget) {
    final amount = budget['approvedAmount']?.toString();
    final currency = budget['currencyCode']?.toString();
    final kind = budget['kind']?.toString() ?? 'Budget';
    final program = budget['programCode']?.toString();
    final unitId = budget['unitId']?.toString();
    final fiscalCode = _selectedYear?['code']?.toString();
    return Card(
      margin: const EdgeInsets.only(bottom: 9),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    kind,
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
                IconButton(
                  tooltip: 'Save budget record',
                  onPressed: () => _toggleSavedBudget(budget),
                  icon: Icon(
                    SavedLibrary.instance.contains('budget:${budget['id']}')
                        ? Icons.bookmark
                        : Icons.bookmark_border,
                  ),
                ),
                if (budget['isCurrent'] == true)
                  Chip(
                    label: const Text('Current'),
                    visualDensity: VisualDensity.compact,
                    backgroundColor: context.colors.secondaryContainer,
                  ),
              ],
            ),
            const SizedBox(height: 6),
            if (amount != null || currency != null)
              Text(
                '${currency ?? ''} ${amount ?? 'Amount unavailable'}'.trim(),
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: context.colors.primary,
                ),
              ),
            const SizedBox(height: 5),
            if (fiscalCode != null) Text('Fiscal period: $fiscalCode'),
            if (program != null && program.isNotEmpty)
              Text('Program: $program'),
            if (unitId != null && unitId.isNotEmpty)
              Text('Budget unit ID: $unitId'),
            Text('Budget record ID: ${budget['id'] ?? 'Unavailable'}'),
          ],
        ),
      ),
    );
  }

  Widget _message({
    required IconData icon,
    required String title,
    required String body,
    String? action,
    VoidCallback? onPressed,
  }) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: Column(
      children: [
        Icon(icon, color: context.colors.primary),
        const SizedBox(height: 8),
        Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
        const SizedBox(height: 5),
        Text(
          body,
          textAlign: TextAlign.center,
          style: TextStyle(color: context.colors.onSurfaceVariant),
        ),
        if (action != null && onPressed != null) ...[
          const SizedBox(height: 8),
          TextButton(onPressed: onPressed, child: Text(action)),
        ],
      ],
    ),
  );
}
