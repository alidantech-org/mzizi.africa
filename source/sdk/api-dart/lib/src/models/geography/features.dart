import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'features.g.dart';

/// The one identity of every place, natural or administrative. A country's feature shares the country's identity; parents and ranks are dated relationships, never columns here.
@JsonSerializable(includeIfNull: false)
class GeographyFeatures {
  const GeographyFeatures({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.endedOn,
    this.establishedOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endedOn;
  final DateTime? establishedOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GeographyFeatures.fromJson(Map<String, dynamic> json) => _$GeographyFeaturesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeaturesToJson(this);
}
