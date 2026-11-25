import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'coalitions.g.dart';

/// A coalition of parties (Azimio, Kenya Kwanza).
@JsonSerializable(includeIfNull: false)
class PoliticsCoalitions {
  const PoliticsCoalitions({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory PoliticsCoalitions.fromJson(Map<String, dynamic> json) => _$PoliticsCoalitionsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsCoalitionsToJson(this);
}
