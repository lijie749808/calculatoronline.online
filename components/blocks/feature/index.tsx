import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { Link } from "@/i18n/routing";

export default function Feature({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-2">
          <h2 className="mb-2 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((item, i) => (
            <div key={i} className="flex flex-col h-full">
              {item.icon && (
                <div className="mb-5 flex size-16 items-center justify-center rounded-full border border-primary">
                  <Icon name={item.icon} className="size-8 text-primary" />
                </div>
              )}
              <h3 className="mb-4 text-xl font-semibold">{item.title}</h3>
              
              {/* 如果有子项目（工具链接），显示链接网格 */}
              {item.children && item.children.length > 0 ? (
                <div className="flex-1 space-y-2">
                  {item.children.map((child, j) => (
                    <Link 
                      key={j} 
                      href={child.url as any} 
                      target={child.target || "_self"}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200 py-2 px-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-muted-foreground/20"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              ) : (
                /* 如果没有子项目，显示原来的描述文字 */
                <p className="text-muted-foreground flex-1">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
