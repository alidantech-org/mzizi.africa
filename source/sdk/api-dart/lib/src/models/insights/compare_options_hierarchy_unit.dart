import 'package:json_annotation/json_annotation.dart';

part 'compare_options_hierarchy_unit.g.dart';

/// Compare Options Hierarchy Unit
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsHierarchyUnit {
  const InsightsCompareOptionsHierarchyUnit({
    required this.featureId,
    required this.kindCode,
    required this.kindLabel,
    required this.name,
    this.path,
  });
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String? path;

  factory InsightsCompareOptionsHierarchyUnit.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsHierarchyUnitFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsHierarchyUnitToJson(this);
}
