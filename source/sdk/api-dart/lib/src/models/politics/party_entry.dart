import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/politics/party_entry_names.dart';

part 'party_entry.g.dart';

/// Party Entry
@JsonSerializable(includeIfNull: false)
class PoliticsPartyEntry {
  const PoliticsPartyEntry({required this.code, this.fromYear, required this.kindTerm, required this.names, required this.partyId, this.toYear});
  final String code;
  final int? fromYear;
  final String kindTerm;
  final List<PoliticsPartyEntryNames> names;
  final String partyId;
  final int? toYear;

  factory PoliticsPartyEntry.fromJson(Map<String, dynamic> json) => _$PoliticsPartyEntryFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsPartyEntryToJson(this);
}
