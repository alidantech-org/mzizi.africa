import 'package:json_annotation/json_annotation.dart';

part 'leader_tree_levels_unit.g.dart';

/// Leader Tree Levels Unit
@JsonSerializable(includeIfNull: false)
class InsightsLeaderTreeLevelsUnit {
  const InsightsLeaderTreeLevelsUnit({required this.featureId, required this.kindCode, required this.kindLabel, required this.name, this.path});
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String? path;

  factory InsightsLeaderTreeLevelsUnit.fromJson(Map<String, dynamic> json) => _$InsightsLeaderTreeLevelsUnitFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderTreeLevelsUnitToJson(this);
}
