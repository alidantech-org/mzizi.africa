import 'package:json_annotation/json_annotation.dart';

part 'search_input.g.dart';

/// Search Input
@JsonSerializable(includeIfNull: false)
class LocalitySearchInput {
  const LocalitySearchInput({this.languageCode, this.limit, required this.query});
  final String? languageCode;
  final int? limit;
  final String query;

  factory LocalitySearchInput.fromJson(Map<String, dynamic> json) => _$LocalitySearchInputFromJson(json);

  Map<String, dynamic> toJson() => _$LocalitySearchInputToJson(this);
}
