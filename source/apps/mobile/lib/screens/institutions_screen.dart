import 'package:flutter/material.dart';

import '../data/preview_content.dart';
import '../theme/app_colors.dart';
import '../widgets/design_kit.dart';

class InstitutionsScreen extends StatelessWidget {
  const InstitutionsScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Public institutions'),
      centerTitle: false,
    ),
    body: ListView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 28),
      children: [
        const Align(alignment: Alignment.centerLeft, child: PreviewBadge()),
        const SizedBox(height: 10),
        for (final item in PreviewContent.institutions)
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: context.colors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: context.colors.outlineVariant),
            ),
            child: ListTile(
              leading: const Icon(
                Icons.account_balance_outlined,
                color: AppColors.brand,
              ),
              title: Text(
                item.name,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              subtitle: Text(item.type),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => InstitutionProfileScreen(institution: item),
                ),
              ),
            ),
          ),
      ],
    ),
  );
}

class InstitutionProfileScreen extends StatefulWidget {
  const InstitutionProfileScreen({super.key, required this.institution});
  final PreviewInstitution institution;

  @override
  State<InstitutionProfileScreen> createState() =>
      _InstitutionProfileScreenState();
}

class _InstitutionProfileScreenState extends State<InstitutionProfileScreen> {
  static const _tabs = ['Overview', 'Services', 'Projects', 'Budget'];
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final item = widget.institution;
    return Scaffold(
      appBar: AppBar(
        actions: [IconButton(onPressed: null, icon: Icon(Icons.ios_share))],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 28),
        children: [
          Container(
            height: 120,
            decoration: BoxDecoration(
              color: AppColors.brand,
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Icon(
              Icons.account_balance,
              size: 56,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 14),
          Text(
            item.name,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
          ),
          Text(
            item.type,
            style: TextStyle(color: context.colors.onSurfaceVariant),
          ),
          const SizedBox(height: 10),
          UnderlineTabs(
            labels: _tabs,
            selected: _tab,
            onSelected: (i) => setState(() => _tab = i),
          ),
          const SizedBox(height: 16),
          if (_tab == 0) ...[
            Text(item.summary, style: const TextStyle(height: 1.4)),
            const SizedBox(height: 14),
            ValueListenableBuilder<Set<String>>(
              valueListenable: PreviewContent.followed,
              builder: (context, followed, _) {
                final on = followed.contains(item.id);
                return Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: null,
                        icon: const Icon(Icons.language, size: 16),
                        label: const Text('Visit Website'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: () => PreviewContent.toggleFollow(item.id),
                        icon: Icon(
                          on ? Icons.favorite : Icons.favorite_border,
                          size: 16,
                        ),
                        label: Text(on ? 'Following' : 'Follow'),
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.brand,
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 18),
            const Text(
              'Key Information',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            Text(
              'Leadership, contacts and mandate details will appear here once sourced records are published.',
              style: TextStyle(
                height: 1.4,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 10),
            const PreviewBadge(),
          ] else
            Text(
              '${_tabs[_tab]} records are not available yet.',
              style: TextStyle(color: context.colors.onSurfaceVariant),
            ),
        ],
      ),
    );
  }
}
