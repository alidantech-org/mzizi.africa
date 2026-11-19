import 'package:json_annotation/json_annotation.dart';

part 'compare_options_top.g.dart';

/// Compare Options Top
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsTop {
  const InsightsCompareOptionsTop({
    required this.detail,
    required this.featureId,
    required this.name,
    required this.path,
    required this.rank,
    required this.share,
    this.subjectId,
    required this.value,
  });
  final String detail;
  final String featureId;
  final String name;
  final String path;
  final double rank;
  final double share;
  final String? subjectId;
  final double value;

  factory InsightsCompareOptionsTop.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsTopFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsTopToJson(this);
}
