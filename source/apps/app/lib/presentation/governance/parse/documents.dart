// Typed presentation contracts for the open JSON sections of generated insight documents.
// Raw maps are confined to these parsing constructors until Dryv generates nested contracts.
import 'package:mzizi_api/api.dart';

Map<String, Object?> _map(Object? value) =>
    value is Map ? Map<String, Object?>.from(value) : const {};
List<Object?> _list(Object? value) =>
    value is List ? List<Object?>.from(value) : const [];
String _text(Object? value) => value is String ? value : '';
double? _number(Object? value) => value is num ? value.toDouble() : null;

class ReferenceLabel {
  const ReferenceLabel(this.code, this.label);
  final String code, label;
  factory ReferenceLabel.parse(Object? raw) {
    final m = _map(raw);
    return ReferenceLabel(_text(m['code']), _text(m['label']));
  }
}

class InstitutionItem {
  const InstitutionItem({
    required this.code,
    required this.name,
    required this.purpose,
    required this.kind,
    required this.arm,
    required this.basis,
    required this.image,
    required this.leaders,
    required this.functions,
  });
  final String code, name, purpose, kind, arm, basis, image;
  final int leaders;
  final List<String> functions;
  factory InstitutionItem.parse(Object? raw) {
    final m = _map(raw);
    return InstitutionItem(
      code: _text(m['code']),
      name: _text(m['name']),
      purpose: _text(m['purpose']),
      kind: ReferenceLabel.parse(m['kind']).label,
      arm: ReferenceLabel.parse(m['arm']).label,
      basis: ReferenceLabel.parse(m['basis']).label,
      image: _text(m['image']),
      leaders: (_number(m['leaders']) ?? 0).toInt(),
      functions: _list(m['functions']).whereType<String>().toList(),
    );
  }
}

class InstitutionArm {
  const InstitutionArm(this.code, this.label, this.about, this.institutions);
  final String code, label, about;
  final List<InstitutionItem> institutions;
  factory InstitutionArm.parse(Object? raw) {
    final m = _map(raw);
    final groups = _list(m['groups']);
    final items = groups.isEmpty
        ? _list(m['institutions'])
        : [for (final g in groups) ..._list(_map(g)['institutions'])];
    return InstitutionArm(
      _text(m['code']),
      _text(m['label']),
      _text(m['about']),
      items.map(InstitutionItem.parse).toList(),
    );
  }
}

class GovernanceCategory {
  const GovernanceCategory(this.code, this.label, this.about);
  final String code, label, about;
  factory GovernanceCategory.parse(Object? raw) {
    final m = _map(raw);
    return GovernanceCategory(
      _text(m['code']),
      _text(m['label']),
      _text(m['about']),
    );
  }
}

class GovernanceMenu {
  GovernanceMenu(InsightsGovernanceTabs raw)
    : categories = raw.tabs.map(GovernanceCategory.parse).toList(),
      arms = raw.arms.map(InstitutionArm.parse).toList();
  final List<GovernanceCategory> categories;
  final List<InstitutionArm> arms;
}

class TreePerformance {
  const TreePerformance(this.value, this.label, this.rank, this.total);
  final double value;
  final String label;
  final int? rank, total;
  static TreePerformance? parse(Object? raw) {
    if (raw == null) return null;
    final m = _map(raw),
        value = _number(_map(raw)['score']) ?? _number(_map(raw)['value']);
    if (value == null) return null;
    return TreePerformance(
      value,
      _text(m['text']).isEmpty ? _text(m['label']) : _text(m['text']),
      _number(m['rank'])?.toInt(),
      _number(m['of'])?.toInt(),
    );
  }
}

class GovernanceNode {
  const GovernanceNode({
    required this.id,
    required this.name,
    required this.type,
    required this.level,
    required this.purpose,
    required this.title,
    required this.how,
    required this.body,
    required this.photo,
    required this.code,
    required this.holderId,
    required this.references,
    this.performance,
  });
  final String id,
      name,
      type,
      level,
      purpose,
      title,
      how,
      body,
      photo,
      code,
      holderId;
  final List<String> references;
  final TreePerformance? performance;
  factory GovernanceNode.parse(Object? raw) {
    final m = _map(raw);
    return GovernanceNode(
      id: _text(m['id']),
      name: _text(m['name']),
      type: _text(m['type']),
      level: _text(m['level']),
      purpose: _text(m['purpose']),
      title: ReferenceLabel.parse(m['tier']).label,
      how: ReferenceLabel.parse(m['how']).label,
      body: _text(_map(m['body'])['name']),
      photo: _text(m['photo']),
      code: _text(m['code']),
      holderId: _text(m['holderId']),
      references: [
        for (final e in _map(m['refs']).entries) '${e.key}: ${e.value}',
      ],
      performance: TreePerformance.parse(m['performance']),
    );
  }
}

class GovernanceEdge {
  const GovernanceEdge(this.from, this.to, this.kind);
  final String from, to, kind;
  factory GovernanceEdge.parse(Object? raw) {
    final m = _map(raw);
    return GovernanceEdge(_text(m['from']), _text(m['to']), _text(m['kind']));
  }
}

class GovernanceLevel {
  const GovernanceLevel(this.code, this.label, this.about, this.count);
  final String code, label, about;
  final int count;
  factory GovernanceLevel.parse(Object? raw) {
    final m = _map(raw);
    return GovernanceLevel(
      _text(m['code']),
      _text(m['label']),
      _text(m['about']),
      (_number(m['count']) ?? 0).toInt(),
    );
  }
}

class GovernanceDocument {
  GovernanceDocument(InsightsGovernanceTree raw)
    : nodes = raw.nodes.map(GovernanceNode.parse).toList(),
      edges = raw.edges.map(GovernanceEdge.parse).toList(),
      levels = raw.rail.map(GovernanceLevel.parse).toList(),
      category = GovernanceCategory.parse(raw.tab),
      legend = raw.legend.map(ReferenceLabel.parse).toList(),
      gaps = raw.gaps,
      placeLevel = raw.place?.kindCode.split('.').last;
  final String? placeLevel;
  final List<GovernanceNode> nodes;
  final List<GovernanceEdge> edges;
  final List<GovernanceLevel> levels;
  final GovernanceCategory category;
  final List<ReferenceLabel> legend;
  final List<String> gaps;
}

class LegalItem {
  const LegalItem(
    this.designation,
    this.instrument,
    this.heading,
    this.excerpt,
    this.explanation,
    this.status,
    this.provisionCode,
  );
  final String designation,
      instrument,
      heading,
      excerpt,
      explanation,
      status,
      provisionCode;
  factory LegalItem.parse(Object? raw) {
    final m = _map(raw);
    return LegalItem(
      _text(m['designation']),
      _text(m['instrument']),
      _text(m['heading']).isEmpty ? _text(m['title']) : _text(m['heading']),
      _text(m['excerpt']),
      _text(m['explanation']),
      _text(m['reviewStatus']),
      _text(m['provisionCode']),
    );
  }
}

class ContentItem {
  const ContentItem({
    required this.slug,
    required this.title,
    required this.summary,
    required this.body,
    required this.image,
    required this.category,
    required this.tags,
    required this.development,
    required this.subjectTable,
    required this.subjectCode,
  });
  final String slug,
      title,
      summary,
      body,
      image,
      category,
      subjectTable,
      subjectCode;
  final List<String> tags;
  final bool development;
  factory ContentItem.parse(Object? raw) {
    final m = _map(raw), subject = _map(_map(raw)['subject']);
    return ContentItem(
      slug: _text(m['slug']),
      title: _text(m['title']),
      summary: _text(m['summary']),
      body: _text(m['body']),
      image: _text(m['image']),
      category: ReferenceLabel.parse(m['category']).label,
      tags: _list(m['tags']).whereType<String>().toList(),
      development: m['isDevelopmentText'] == true,
      subjectTable: _text(subject['table']),
      subjectCode: _text(subject['code']),
    );
  }
}

class InstitutionDocument {
  InstitutionDocument(InsightsInstitutionDetail raw)
    : institution = InstitutionItem.parse(raw.institution),
      content = raw.content.map(ContentItem.parse).toList(),
      legal = raw.legalBasis.map(LegalItem.parse).toList(),
      leaders = raw.leaders.map(InstitutionLeader.parse).toList(),
      children = raw.children.map(InstitutionItem.parse).toList(),
      parents = raw.parents.map(InstitutionItem.parse).toList(),
      gaps = raw.gaps;
  final InstitutionItem institution;
  final List<ContentItem> content;
  final List<LegalItem> legal;
  final List<InstitutionLeader> leaders;
  final List<InstitutionItem> children, parents;
  final List<String> gaps;
}

class InstitutionLeader {
  const InstitutionLeader(this.id, this.name, this.title, this.how, this.photo);
  final String id, name, title, how, photo;
  factory InstitutionLeader.parse(Object? raw) {
    final m = _map(raw);
    return InstitutionLeader(
      _text(m['holderId']),
      _text(m['name']),
      ReferenceLabel.parse(m['tier']).label,
      ReferenceLabel.parse(m['how']).label,
      _text(m['photo']),
    );
  }
}

class SpeechItem {
  const SpeechItem(
    this.name,
    this.summary,
    this.words,
    this.holderId,
    this.motionCode,
    this.motion,
    this.date,
  );
  final String name, summary, holderId, motionCode, motion, date;
  final int? words;
  factory SpeechItem.parse(Object? raw) {
    final m = _map(raw);
    return SpeechItem(
      _text(m['name']),
      _text(m['summary']),
      _number(m['word_count'])?.toInt(),
      _text(m['holder_id']),
      _text(m['motion_code']),
      _text(m['motion']),
      _text(m['held_on']),
    );
  }
}

class SpeechCollection {
  SpeechCollection.parse(Object? raw)
    : items = _list(raw).map(SpeechItem.parse).toList();
  final List<SpeechItem> items;
}
