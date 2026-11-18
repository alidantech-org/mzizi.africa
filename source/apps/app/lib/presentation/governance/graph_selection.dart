// A graph view hides inactive levels and preserves only relationships explicitly present in the response.
import 'package:mzizi_app/presentation/governance/parse/documents.dart';

class GovernanceSelection {
  GovernanceSelection(GovernanceDocument document, String? level) {
    nodes = level == null
        ? document.nodes
        : document.nodes.where((node) => node.level == level).toList();
    final visible = nodes.map((node) => node.id).toSet();
    edges = document.edges
        .where(
          (edge) => visible.contains(edge.from) && visible.contains(edge.to),
        )
        .toList();
    hiddenRelationships = document.edges.length - edges.length;
  }
  late final List<GovernanceNode> nodes;
  late final List<GovernanceEdge> edges;
  late final int hiddenRelationships;
}

/// Prefer the selected place's populated level, otherwise the first populated backend level.
String? preferredGovernanceLevel(GovernanceDocument document) {
  final populated = document.nodes
      .where((node) => node.holderId.isNotEmpty)
      .map((node) => node.level)
      .where((level) => level.isNotEmpty)
      .toSet();
  if (populated.contains(document.placeLevel)) return document.placeLevel;
  for (final level in document.levels) {
    if (populated.contains(level.code)) return level.code;
  }
  return populated.firstOrNull;
}
