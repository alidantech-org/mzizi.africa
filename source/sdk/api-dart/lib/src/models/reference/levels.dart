import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/hierarchies.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'levels.g.dart';

/// A rank of one hierarchy (Kenya 2013: county, sub-county, ward).
@JsonSerializable(includeIfNull: false)
class ReferenceLevels {
  const ReferenceLevels({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.depth,
    required this.hierarchyId,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int depth;
  final String hierarchyId;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final DateTime updatedAt;
  final int version;

  factory ReferenceLevels.fromJson(Map<String, dynamic> json) => _$ReferenceLevelsFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLevelsToJson(this);
}
