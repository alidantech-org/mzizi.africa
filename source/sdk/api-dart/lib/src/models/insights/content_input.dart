import 'package:json_annotation/json_annotation.dart';

part 'content_input.g.dart';

/// Content Input
@JsonSerializable(includeIfNull: false)
class InsightsContentInput {
  const InsightsContentInput({this.languageCode, this.slug, this.subjectCode, this.subjectTable});
  final String? languageCode;
  final String? slug;
  final String? subjectCode;
  final String? subjectTable;

  factory InsightsContentInput.fromJson(Map<String, dynamic> json) => _$InsightsContentInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentInputToJson(this);
}
