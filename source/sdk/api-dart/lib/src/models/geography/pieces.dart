import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/geography/geometries.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'pieces.g.dart';

/// Subdivided polygons with a spatial index, so "where am I?" lookups stay fast even for long coastlines.
@JsonSerializable(includeIfNull: false)
class GeographyPieces {
  const GeographyPieces({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.geometry,
    required this.geometryId,
    required this.id,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final Object? geometry;
  final String geometryId;
  final String id;

  factory GeographyPieces.fromJson(Map<String, dynamic> json) => _$GeographyPiecesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPiecesToJson(this);
}
