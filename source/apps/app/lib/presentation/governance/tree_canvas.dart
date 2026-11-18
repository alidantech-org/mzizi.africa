// An interactive relationship canvas with fitted, bounded zoom and viewport-centred controls.
import 'dart:math' as math;
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/governance/graph_selection.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/governance/tree_layout.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/media_gallery.dart';

class GovernanceCanvas extends StatefulWidget {
  const GovernanceCanvas({
    super.key,
    required this.selection,
    required this.selectionKey,
    required this.onNode,
  });
  final GovernanceSelection selection;
  final String selectionKey;
  final ValueChanged<GovernanceNode> onNode;
  @override
  State<GovernanceCanvas> createState() => _GovernanceCanvasState();
}

class _GovernanceCanvasState extends State<GovernanceCanvas> {
  final TransformationController _transform = TransformationController();
  String _fittedFor = '';
  static const double _minScale = 0.08, _maxScale = 2.8;
  @override
  void dispose() {
    _transform.dispose();
    super.dispose();
  }

  void _fit(GovernanceLayout layout, Size viewport) {
    final scale = math
        .min(
          (viewport.width - 32) / layout.size.width,
          (viewport.height - 32) / layout.size.height,
        )
        .clamp(_minScale, 1.0);
    _transform.value = Matrix4.diagonal3Values(scale, scale, 1)
      ..setTranslationRaw(
        (viewport.width - layout.size.width * scale) / 2,
        (viewport.height - layout.size.height * scale) / 2,
        0,
      );
  }

  void _focus(GovernanceLayout layout, Size viewport) {
    final node =
        widget.selection.nodes
            .where((n) => n.holderId.isNotEmpty)
            .firstOrNull ??
        widget.selection.nodes.first;
    final position = layout.positions[node.id]!;
    final scale = math
        .min(1.0, (viewport.width - 48) / GovernanceLayout.nodeWidth)
        .clamp(_minScale, _maxScale);
    _transform.value = Matrix4.diagonal3Values(scale, scale, 1)
      ..setTranslationRaw(
        viewport.width / 2 -
            (position.dx + GovernanceLayout.nodeWidth / 2) * scale,
        viewport.height / 2 -
            (position.dy + GovernanceLayout.nodeHeight / 2) * scale,
        0,
      );
  }

  void _zoom(Size viewport, double multiplier) {
    final centre = Offset(viewport.width / 2, viewport.height / 2);
    final scene = _transform.toScene(centre);
    final scale = (_transform.value.getMaxScaleOnAxis() * multiplier).clamp(
      _minScale,
      _maxScale,
    );
    _transform.value = Matrix4.diagonal3Values(scale, scale, 1)
      ..setTranslationRaw(
        centre.dx - scene.dx * scale,
        centre.dy - scene.dy * scale,
        0,
      );
  }

  @override
  Widget build(BuildContext context) {
    final layout = GovernanceLayout(
      widget.selection.nodes,
      widget.selection.edges,
    );
    return LayoutBuilder(
      builder: (context, box) {
        final viewport = Size(box.maxWidth, box.maxHeight);
        final fitKey = '${widget.selectionKey}|$viewport';
        if (_fittedFor != fitKey) {
          _fittedFor = fitKey;
          _fit(layout, viewport);
        }
        return Stack(
          children: [
            Positioned.fill(
              child: InteractiveViewer(
                transformationController: _transform,
                constrained: false,
                minScale: _minScale,
                maxScale: _maxScale,
                boundaryMargin: EdgeInsets.all(
                  math.max(viewport.width, viewport.height),
                ),
                child: SizedBox(
                  width: layout.size.width,
                  height: layout.size.height,
                  child: Stack(
                    children: [
                      Positioned.fill(
                        child: CustomPaint(
                          painter: _TreeLines(
                            layout,
                            widget.selection.edges,
                            Theme.of(context).colorScheme.outlineVariant,
                          ),
                        ),
                      ),
                      for (final node in widget.selection.nodes)
                        Positioned(
                          left: layout.positions[node.id]!.dx,
                          top: layout.positions[node.id]!.dy,
                          width: GovernanceLayout.nodeWidth,
                          height: GovernanceLayout.nodeHeight,
                          child: GovernanceNodeTile(
                            node: node,
                            onTap: () => widget.onNode(node),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              right: 10,
              top: 10,
              child: Material(
                elevation: 2,
                color: Theme.of(context).colorScheme.surfaceContainerHigh,
                borderRadius: BorderRadius.circular(18),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      key: const ValueKey('tree-zoom-in'),
                      tooltip: t(context, 'Zoom in'),
                      icon: const Icon(Icons.add),
                      onPressed: () => _zoom(viewport, 1.3),
                    ),
                    IconButton(
                      key: const ValueKey('tree-zoom-out'),
                      tooltip: t(context, 'Zoom out'),
                      icon: const Icon(Icons.remove),
                      onPressed: () => _zoom(viewport, 1 / 1.3),
                    ),
                    IconButton(
                      key: const ValueKey('tree-fit'),
                      tooltip: t(context, 'Fit whole tree'),
                      icon: const Icon(Icons.fit_screen),
                      onPressed: () => _fit(layout, viewport),
                    ),
                    IconButton(
                      key: const ValueKey('tree-reset'),
                      tooltip: t(context, 'Reset view'),
                      icon: const Icon(Icons.center_focus_strong),
                      onPressed: () => _focus(layout, viewport),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

class GovernanceNodeTile extends StatelessWidget {
  const GovernanceNodeTile({
    super.key,
    required this.node,
    required this.onTap,
  });
  final GovernanceNode node;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: [
        node.name,
        node.title,
        node.purpose,
      ].where((e) => e.isNotEmpty).join('\n'),
      child: Material(
        color: node.type == 'leader'
            ? scheme.surfaceContainerLow
            : scheme.primaryContainer,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: BorderSide(color: scheme.outlineVariant),
        ),
        child: InkWell(
          key: ValueKey('tree-node-${node.id}'),
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    if (node.photo.isNotEmpty) ...[
                      Portrait(name: node.name, url: node.photo, size: 34),
                      const SizedBox(width: 8),
                    ] else ...[
                      Icon(
                        node.type == 'root'
                            ? Icons.public
                            : Icons.account_balance_outlined,
                        size: 26,
                        color: scheme.primary,
                      ),
                      const SizedBox(width: 8),
                    ],
                    Expanded(
                      child: Text(
                        node.title.isEmpty ? node.name : node.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.labelLarge,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: Text(
                    node.title.isEmpty ? node.purpose : node.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ),
                if (node.performance case final performance?) ...[
                  Text(
                    '${compact(performance.value)}%${performance.rank == null ? '' : ' · #${performance.rank}'}',
                    style: Theme.of(context).textTheme.labelSmall,
                  ),
                  Text(
                    performance.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.labelSmall,
                  ),
                  const SizedBox(height: 4),
                  LinearProgressIndicator(
                    value: (performance.value / 100).clamp(0, 1),
                    minHeight: 5,
                    borderRadius: BorderRadius.circular(5),
                  ),
                ] else
                  Text(
                    node.holderId.isEmpty
                        ? node.level
                        : t(context, 'Performance not recorded'),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.labelSmall,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TreeLines extends CustomPainter {
  const _TreeLines(this.layout, this.edges, this.colour);
  final GovernanceLayout layout;
  final List<GovernanceEdge> edges;
  final Color colour;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = colour
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    for (final edge in edges) {
      final from = layout.positions[edge.from], to = layout.positions[edge.to];
      if (from == null || to == null) continue;
      final start =
          from +
          const Offset(
            GovernanceLayout.nodeWidth / 2,
            GovernanceLayout.nodeHeight,
          );
      final end = to + const Offset(GovernanceLayout.nodeWidth / 2, 0);
      final middle = (start.dy + end.dy) / 2;
      canvas.drawPath(
        Path()
          ..moveTo(start.dx, start.dy)
          ..lineTo(start.dx, middle)
          ..lineTo(end.dx, middle)
          ..lineTo(end.dx, end.dy),
        paint,
      );
      // Arrow points toward the actual relationship target, without synthesizing an edge.
      canvas.drawPath(
        Path()
          ..moveTo(end.dx - 4, end.dy - 7)
          ..lineTo(end.dx, end.dy)
          ..lineTo(end.dx + 4, end.dy - 7),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(_TreeLines old) =>
      old.layout != layout || old.colour != colour;
}
