import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'manifests.g.dart';

/// Stable API, website or extraction configuration identity; contents remain versioned artifacts.
@JsonSerializable(includeIfNull: false)
class SourceManifests {
  const SourceManifests({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    required this.kindId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final String kindId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory SourceManifests.fromJson(Map<String, dynamic> json) => _$SourceManifestsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceManifestsToJson(this);
}
