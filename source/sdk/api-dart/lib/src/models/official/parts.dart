import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/official/name_part.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/names.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'parts.g.dart';

/// The parts of a person's name (given, family), for sorting and formal display.
@JsonSerializable(includeIfNull: false)
class OfficialParts {
  const OfficialParts({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.nameId,
    required this.nameKind,
    required this.part,
    required this.position,
    required this.text,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String nameId;
  final SharedIdentityKind nameKind;
  final OfficialNamePart part;
  final int position;
  final String text;

  factory OfficialParts.fromJson(Map<String, dynamic> json) => _$OfficialPartsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialPartsToJson(this);
}
