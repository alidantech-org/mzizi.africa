import 'package:json_annotation/json_annotation.dart';

part 'content_list_input.g.dart';

/// Content List Input
@JsonSerializable(includeIfNull: false)
class InsightsContentListInput {
  const InsightsContentListInput({this.category, this.languageCode, this.limit, this.query, this.tag});
  final String? category;
  final String? languageCode;
  final int? limit;
  final String? query;
  final String? tag;

  factory InsightsContentListInput.fromJson(Map<String, dynamic> json) => _$InsightsContentListInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListInputToJson(this);
}
