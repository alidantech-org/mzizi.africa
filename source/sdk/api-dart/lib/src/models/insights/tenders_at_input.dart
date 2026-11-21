import 'package:json_annotation/json_annotation.dart';

part 'tenders_at_input.g.dart';

/// Tenders At Input
@JsonSerializable(includeIfNull: false)
class InsightsTendersAtInput {
  const InsightsTendersAtInput({required this.countryCode, this.languageCode, this.limit, this.path, this.status});
  final String countryCode;
  final String? languageCode;
  final int? limit;
  final String? path;
  final String? status;

  factory InsightsTendersAtInput.fromJson(Map<String, dynamic> json) => _$InsightsTendersAtInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTendersAtInputToJson(this);
}
