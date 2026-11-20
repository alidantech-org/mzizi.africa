import 'package:json_annotation/json_annotation.dart';

part 'place.g.dart';

/// Place
@JsonSerializable(includeIfNull: false)
class ExplorerPlace {
  const ExplorerPlace({
    required this.canonicalPath,
    required this.citationCount,
    required this.code,
    required this.countryCode,
    required this.depth,
    required this.featureId,
    required this.kind,
    required this.name,
    this.nameLanguage,
    this.parentFeatureId,
  });
  final String canonicalPath;
  final int citationCount;
  final String code;
  final String countryCode;
  final int depth;
  final String featureId;
  final String kind;
  final String name;
  final String? nameLanguage;
  final String? parentFeatureId;

  factory ExplorerPlace.fromJson(Map<String, dynamic> json) => _$ExplorerPlaceFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerPlaceToJson(this);
}
