/// Previous and next controls over a page window; "next" is offered when the last page came back full.
library;

import 'package:material_ui/material_ui.dart';
import 'package:mzizi_ui/src/types.dart';

class MziziPaginationBar extends StatelessWidget {
  const MziziPaginationBar({
    super.key,
    required this.window,
    required this.received,
    required this.onChange,
  });

  final PageWindow window;
  final int received;
  final void Function(PageWindow window) onChange;

  @override
  Widget build(BuildContext context) {
    final hasPrevious = window.offset > 0;
    final hasNext = received >= window.limit;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        TextButton(
          onPressed: hasPrevious
              ? () => onChange(window.movedTo(window.offset - window.limit))
              : null,
          child: const Text('Previous'),
        ),
        Text('${window.offset + 1} to ${window.offset + received}'),
        TextButton(
          onPressed: hasNext
              ? () => onChange(window.movedTo(window.offset + window.limit))
              : null,
          child: const Text('Next'),
        ),
      ],
    );
  }
}
