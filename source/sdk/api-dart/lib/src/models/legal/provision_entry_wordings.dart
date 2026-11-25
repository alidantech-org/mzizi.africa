import 'package:json_annotation/json_annotation.dart';

part 'provision_entry_wordings.g.dart';

/// Provision Entry Wordings
@JsonSerializable(includeIfNull: false)
class LegalProvisionEntryWordings {
  const LegalProvisionEntryWordings({required this.editionId, this.heading, required this.languageCode, required this.text});
  final String editionId;
  final String? heading;
  final String languageCode;
  final String text;

  factory LegalProvisionEntryWordings.fromJson(Map<String, dynamic> json) => _$LegalProvisionEntryWordingsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalProvisionEntryWordingsToJson(this);
}
