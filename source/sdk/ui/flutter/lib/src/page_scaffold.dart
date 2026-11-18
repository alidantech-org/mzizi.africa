/// The page frame: an app bar with the title and a padded scrolling body, coloured by the app theme.
library;

import 'package:material_ui/material_ui.dart';

class MziziPageScaffold extends StatelessWidget {
  const MziziPageScaffold({
    super.key,
    required this.title,
    required this.children,
  });

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          for (final child in children) ...[child, const SizedBox(height: 16)],
        ],
      ),
    );
  }
}

/// A raised block of a page.
class MziziSection extends StatelessWidget {
  const MziziSection({super.key, this.title, required this.child});

  final String? title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      color: theme.colorScheme.surfaceContainerHighest,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (title != null) ...[
              Text(title!, style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
            ],
            child,
          ],
        ),
      ),
    );
  }
}
