import 'package:json_annotation/json_annotation.dart';

part 'search_input.g.dart';

/// Search Input
@JsonSerializable(includeIfNull: false)
class ExplorerSearchInput {
  const ExplorerSearchInput({
    required this.countryCode,
    this.depth,
    this.kindCode,
    this.languageCode,
    this.limit,
    this.page,
    this.parentFeatureId,
    this.query,
  });
  final String countryCode;
  final int? depth;
  final String? kindCode;
  final String? languageCode;
  final int? limit;
  final int? page;
  final String? parentFeatureId;
  final String? query;

  factory ExplorerSearchInput.fromJson(Map<String, dynamic> json) => _$ExplorerSearchInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerSearchInputToJson(this);
}
