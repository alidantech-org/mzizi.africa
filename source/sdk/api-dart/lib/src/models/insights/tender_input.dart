import 'package:json_annotation/json_annotation.dart';

part 'tender_input.g.dart';

/// Tender Input
@JsonSerializable(includeIfNull: false)
class InsightsTenderInput {
  const InsightsTenderInput({this.featureId, this.limit, this.status});
  final String? featureId;
  final int? limit;
  final String? status;

  factory InsightsTenderInput.fromJson(Map<String, dynamic> json) => _$InsightsTenderInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTenderInputToJson(this);
}
