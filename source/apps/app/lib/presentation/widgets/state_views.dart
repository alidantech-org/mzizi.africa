import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

/// Skeleton geometry follows the destination, keeping loading and content aligned.
enum LoadingLayout { list, compact, article, tree }

class LoadingView extends StatefulWidget {
  const LoadingView({super.key, this.layout = LoadingLayout.list});
  final LoadingLayout layout;
  @override
  State<LoadingView> createState() => _LoadingViewState();
}

class _LoadingViewState extends State<LoadingView>
    with SingleTickerProviderStateMixin {
  late final AnimationController _sweep = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  );
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _sweep.stop();
    } else if (!_sweep.isAnimating) {
      _sweep.repeat();
    }
  }

  @override
  void dispose() {
    _sweep.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    Widget block(double height, {double? width}) => Container(
      height: height,
      width: width,
      decoration: BoxDecoration(
        color: scheme.onSurface.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
      ),
    );
    Widget line() =>
        Padding(padding: const EdgeInsets.only(bottom: 10), child: block(15));
    final skeleton = Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.layout == LoadingLayout.article) ...[
            block(170),
            const SizedBox(height: 22),
          ],
          block(24, width: 180),
          const SizedBox(height: 18),
          if (widget.layout == LoadingLayout.tree) ...[
            Center(child: block(100, width: 150)),
            const SizedBox(height: 32),
            Row(
              children: [
                Expanded(child: block(100)),
                const SizedBox(width: 18),
                Expanded(child: block(100)),
              ],
            ),
          ] else if (widget.layout == LoadingLayout.article) ...[
            for (var i = 0; i < 6; i++) line(),
          ] else if (widget.layout == LoadingLayout.compact) ...[
            block(48),
            const SizedBox(height: 12),
            block(48),
          ] else ...[
            Row(
              children: [
                Expanded(child: block(92)),
                const SizedBox(width: 12),
                Expanded(child: block(92)),
              ],
            ),
            const SizedBox(height: 12),
            for (var i = 0; i < 3; i++) ...[
              block(60),
              const SizedBox(height: 12),
            ],
          ],
        ],
      ),
    );
    return Semantics(
      label: t(context, 'Loading information'),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final shimmer = AnimatedBuilder(
            animation: _sweep,
            builder: (context, child) => ShaderMask(
              blendMode: BlendMode.srcATop,
              shaderCallback: (bounds) => LinearGradient(
                begin: Alignment(-3 + _sweep.value * 6, -0.2),
                end: Alignment(-1 + _sweep.value * 6, 0.2),
                colors: [
                  scheme.surface.withValues(alpha: 0),
                  scheme.surface.withValues(alpha: 0.7),
                  scheme.surface.withValues(alpha: 0),
                ],
              ).createShader(bounds),
              child: child,
            ),
            child: skeleton,
          );
          return constraints.hasBoundedHeight
              ? SingleChildScrollView(
                  physics: const NeverScrollableScrollPhysics(),
                  child: shimmer,
                )
              : shimmer;
        },
      ),
    );
  }
}

/// A failure message with a retry button.
class ErrorView extends StatelessWidget {
  const ErrorView({
    super.key,
    required this.message,
    required this.retryLabel,
    required this.onRetry,
  });

  final String message;
  final String retryLabel;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: scheme.error.withValues(alpha: 0.1),
              ),
              child: Center(
                child: MzIcon('info', size: 40, color: scheme.error),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              t(
                context,
                'We could not load this information. Please try again.',
              ),
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 14),
            FilledButton.tonal(onPressed: onRetry, child: Text(retryLabel)),
          ],
        ),
      ),
    );
  }
}

/// Nothing to show: an illustration-style icon, a title and a line saying why or what to do.
class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    this.body,
  });
  final String icon;
  final String title;
  final String? body;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
      child: Column(
        children: [
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  scheme.primary.withValues(alpha: 0.18),
                  scheme.tertiary.withValues(alpha: 0.12),
                ],
              ),
            ),
            child: Center(child: MzIcon(icon, size: 42, color: scheme.primary)),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          if (body != null)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                body!,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
        ],
      ),
    );
  }
}
