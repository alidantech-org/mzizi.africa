import 'package:json_annotation/json_annotation.dart';

part 'board_input.g.dart';

/// Board Input
@JsonSerializable(includeIfNull: false)
class InsightsBoardInput {
  const InsightsBoardInput({this.kindCode, this.limit, required this.metricCode, this.parentFeatureId});
  final String? kindCode;
  final int? limit;
  final String metricCode;
  final String? parentFeatureId;

  factory InsightsBoardInput.fromJson(Map<String, dynamic> json) => _$InsightsBoardInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsBoardInputToJson(this);
}
