import 'package:json_annotation/json_annotation.dart';

part 'browse_input.g.dart';

/// Browse Input
@JsonSerializable(includeIfNull: false)
class InsightsBrowseInput {
  const InsightsBrowseInput({this.featureId});
  final String? featureId;

  factory InsightsBrowseInput.fromJson(Map<String, dynamic> json) => _$InsightsBrowseInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsBrowseInputToJson(this);
}
