import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';

/// A heart that pops when toggled: follow a leader or like a project.
class HeartButton extends ConsumerStatefulWidget {
  const HeartButton({
    super.key,
    required this.kind,
    required this.item,
    required this.tooltip,
  });

  final SavedKind kind;
  final SavedItem item;
  final String tooltip;

  @override
  ConsumerState<HeartButton> createState() => _HeartButtonState();
}

class _HeartButtonState extends ConsumerState<HeartButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pop = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 320),
    lowerBound: 1,
    upperBound: 1.4,
  );

  @override
  void dispose() {
    _pop.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final on = ref.watch(
      savedProvider.select(
        (s) => switch (widget.kind) {
          SavedKind.place => s.places,
          SavedKind.leader => s.leaders,
          SavedKind.project => s.projects,
          SavedKind.spot => s.spots,
        }.any((e) => e.id == widget.item.id),
      ),
    );
    return Tooltip(
      message: widget.tooltip,
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: () {
          ref.read(savedProvider.notifier).toggle(widget.kind, widget.item);
          _pop.forward(from: 1).then((_) => _pop.reverse());
        },
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: ScaleTransition(
            scale: _pop,
            child: Icon(
              on ? Icons.favorite : Icons.favorite_border,
              color: on ? MziziTokens.clay : null,
              size: 22,
            ),
          ),
        ),
      ),
    );
  }
}

/// A chip-style toggle for saving a place or a GPS spot.
class KeepChip extends ConsumerWidget {
  const KeepChip({
    super.key,
    required this.kind,
    required this.item,
    required this.onLabel,
    required this.offLabel,
    required this.icon,
  });

  final SavedKind kind;
  final SavedItem item;
  final String onLabel;
  final String offLabel;
  final IconData icon;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final on = ref.watch(
      savedProvider.select(
        (s) => (kind == SavedKind.spot ? s.spots : s.places).any(
          (e) => e.id == item.id,
        ),
      ),
    );
    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        color: on ? MziziTokens.clay : null,
        border: Border.all(
          color: on ? MziziTokens.clay : Theme.of(context).dividerColor,
        ),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: () => ref.read(savedProvider.notifier).toggle(kind, item),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                on ? Icons.check : icon,
                size: 18,
                color: on ? MziziTokens.cream : null,
              ),
              const SizedBox(width: 6),
              Text(
                on ? onLabel : offLabel,
                style: TextStyle(color: on ? MziziTokens.cream : null),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Words for the buttons, so callers stay short.
String keepWord(String language, String key) => tr(language, key);
