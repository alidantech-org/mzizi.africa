// A bounded layered graph layout: backend edges determine depth, never office-name constants.
import 'dart:math' as math;
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';

class GovernanceLayout {
  GovernanceLayout(List<GovernanceNode> nodes, List<GovernanceEdge> edges) {
    final depths = {for (final n in nodes) n.id: 0};
    // Bounded relaxation also terminates safely if malformed data contains a cycle.
    for (var pass = 0; pass < nodes.length; pass++) {
      var changed = false;
      for (final edge in edges) {
        if (!depths.containsKey(edge.from) || !depths.containsKey(edge.to)) {
          continue;
        }
        final proposed = math.min(nodes.length, depths[edge.from]! + 1);
        if (proposed > depths[edge.to]!) {
          depths[edge.to] = proposed;
          changed = true;
        }
      }
      if (!changed) break;
    }
    final levels = <int, List<GovernanceNode>>{};
    for (final node in nodes) {
      levels.putIfAbsent(depths[node.id]!, () => []).add(node);
    }
    final widest = levels.values.fold<int>(
      1,
      (v, row) => math.max(v, row.length),
    );
    size = Size(
      widest * (nodeWidth + gapX) + 32,
      (levels.keys.fold<int>(0, math.max) + 1) * (nodeHeight + gapY) + 32,
    );
    for (final row in levels.entries) {
      final rowWidth = row.value.length * (nodeWidth + gapX) - gapX;
      for (var i = 0; i < row.value.length; i++) {
        positions[row.value[i].id] = Offset(
          (size.width - rowWidth) / 2 + i * (nodeWidth + gapX),
          16 + row.key * (nodeHeight + gapY),
        );
      }
    }
  }
  static const double nodeWidth = 196, nodeHeight = 154, gapX = 24, gapY = 52;
  final Map<String, Offset> positions = {};
  late final Size size;
}
