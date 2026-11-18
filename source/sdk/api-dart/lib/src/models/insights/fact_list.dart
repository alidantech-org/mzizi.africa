import 'package:json_annotation/json_annotation.dart';

part 'fact_list.g.dart';

/// Fact List
@JsonSerializable(includeIfNull: false)
class InsightsFactList {
  const InsightsFactList({required this.facts, required this.gaps});
  final List<Object?> facts;
  final List<String> gaps;

  factory InsightsFactList.fromJson(Map<String, dynamic> json) => _$InsightsFactListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsFactListToJson(this);
}
