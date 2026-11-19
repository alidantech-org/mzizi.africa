import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/leader_tree_levels.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'leader_tree.g.dart';

/// Leader Tree
@JsonSerializable(includeIfNull: false)
class InsightsLeaderTree {
  const InsightsLeaderTree({required this.gaps, required this.levels, this.place});
  final List<String> gaps;
  final List<InsightsLeaderTreeLevels> levels;
  final InsightsPlaceCrumb? place;

  factory InsightsLeaderTree.fromJson(Map<String, dynamic> json) => _$InsightsLeaderTreeFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderTreeToJson(this);
}
