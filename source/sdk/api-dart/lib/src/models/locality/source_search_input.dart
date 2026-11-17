import 'package:json_annotation/json_annotation.dart';

part 'source_search_input.g.dart';

/// Source Search Input
@JsonSerializable(includeIfNull: false)
class LocalitySourceSearchInput {
  const LocalitySourceSearchInput({this.limit, this.query});
  final int? limit;
  final String? query;

  factory LocalitySourceSearchInput.fromJson(Map<String, dynamic> json) => _$LocalitySourceSearchInputFromJson(json);

  Map<String, dynamic> toJson() => _$LocalitySourceSearchInputToJson(this);
}
