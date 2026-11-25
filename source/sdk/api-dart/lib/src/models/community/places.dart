import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'places.g.dart';

/// A place an actor saved.
@JsonSerializable(includeIfNull: false)
class CommunityPlaces {
  const CommunityPlaces({
    required this.actorId,
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    required this.isHome,
    required this.label,
    this.position,
    this.suggestionTerm,
    required this.updatedAt,
    required this.version,
  });
  final String actorId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final bool isHome;
  final String label;
  final int? position;
  final String? suggestionTerm;
  final DateTime updatedAt;
  final int version;

  factory CommunityPlaces.fromJson(Map<String, dynamic> json) => _$CommunityPlacesFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityPlacesToJson(this);
}
