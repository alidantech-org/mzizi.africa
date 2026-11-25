import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/provision_kind.dart';
import 'package:mzizi_api/src/models/legal/provision_entry_wordings.dart';

part 'provision_entry.g.dart';

/// Provision Entry
@JsonSerializable(includeIfNull: false)
class LegalProvisionEntry {
  const LegalProvisionEntry({
    required this.code,
    required this.designation,
    required this.kind,
    this.parentId,
    required this.position,
    required this.provisionId,
    required this.wordings,
  });
  final String code;
  final String designation;
  final LegalProvisionKind kind;
  final String? parentId;
  final int position;
  final String provisionId;
  final List<LegalProvisionEntryWordings> wordings;

  factory LegalProvisionEntry.fromJson(Map<String, dynamic> json) => _$LegalProvisionEntryFromJson(json);

  Map<String, dynamic> toJson() => _$LegalProvisionEntryToJson(this);
}
