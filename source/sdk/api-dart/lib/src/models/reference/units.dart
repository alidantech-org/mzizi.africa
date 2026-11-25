import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'units.g.dart';

/// A unit of measurement and its exact conversion to a base unit; never a spatial unit.
@JsonSerializable(includeIfNull: false)
class ReferenceUnits {
  const ReferenceUnits({
    this.baseId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.offset,
    required this.quantityTerm,
    required this.scale,
    required this.symbol,
    required this.updatedAt,
    required this.version,
  });
  final String? baseId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final double offset;
  final String quantityTerm;
  final double scale;
  final String symbol;
  final DateTime updatedAt;
  final int version;

  factory ReferenceUnits.fromJson(Map<String, dynamic> json) => _$ReferenceUnitsFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceUnitsToJson(this);
}
