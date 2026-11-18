import 'package:json_annotation/json_annotation.dart';

part 'party_list.g.dart';

/// Party List
@JsonSerializable(includeIfNull: false)
class InsightsPartyList {
  const InsightsPartyList({required this.gaps, required this.parties});
  final List<String> gaps;
  final List<Object?> parties;

  factory InsightsPartyList.fromJson(Map<String, dynamic> json) => _$InsightsPartyListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyListToJson(this);
}
