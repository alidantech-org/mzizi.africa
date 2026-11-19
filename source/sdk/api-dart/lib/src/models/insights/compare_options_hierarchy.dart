import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/compare_options_hierarchy_unit.dart';

part 'compare_options_hierarchy.g.dart';

/// Compare Options Hierarchy
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsHierarchy {
  const InsightsCompareOptionsHierarchy({required this.available, required this.label, this.message, required this.rung, this.unit});
  final bool available;
  final String label;
  final String? message;
  final String rung;
  final InsightsCompareOptionsHierarchyUnit? unit;

  factory InsightsCompareOptionsHierarchy.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsHierarchyFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsHierarchyToJson(this);
}
