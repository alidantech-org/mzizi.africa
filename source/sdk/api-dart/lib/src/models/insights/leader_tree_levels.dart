import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/leader_tree_levels_unit.dart';

part 'leader_tree_levels.g.dart';

/// Leader Tree Levels
@JsonSerializable(includeIfNull: false)
class InsightsLeaderTreeLevels {
  const InsightsLeaderTreeLevels({required this.groups, required this.label, required this.level, required this.total, this.unit});
  final Object? groups;
  final String label;
  final String level;
  final double total;
  final InsightsLeaderTreeLevelsUnit? unit;

  factory InsightsLeaderTreeLevels.fromJson(Map<String, dynamic> json) => _$InsightsLeaderTreeLevelsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderTreeLevelsToJson(this);
}
