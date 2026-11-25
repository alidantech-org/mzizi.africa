import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'eras.g.dart';

/// A named period, possibly inside another.
@JsonSerializable(includeIfNull: false)
class HistoryEras {
  const HistoryEras({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.parentId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String? parentId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory HistoryEras.fromJson(Map<String, dynamic> json) => _$HistoryErasFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryErasToJson(this);
}
